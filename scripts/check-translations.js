#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

/**
 * Recursively get all key paths from an object, including objects inside arrays
 * @param {Object} obj - The object to process
 * @param {string} prefix - The prefix for the key
 * @returns {Array<string>} - An array of all key paths
 */
function getKeysRecursively(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(obj[key])) {
        // Process arrays: check each object in the array
        obj[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const arrayItemKeys = getKeysRecursively(item, `${currentPath}[${index}]`);
            keys = keys.concat(arrayItemKeys);
          }
        });
        // Also record the path of the array itself
        keys.push(currentPath);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively process nested objects
        keys = keys.concat(getKeysRecursively(obj[key], currentPath));
      } else {
        // Add leaf node keys
        keys.push(currentPath);
      }
    }
  }

  return keys;
}

function getResumeIdSets(obj, prefix = 'resume') {
  const resume = obj.resume;
  const sets = {};

  function walk(value, currentPath) {
    if (Array.isArray(value)) {
      const ids = value
        .filter(item => typeof item === 'object' && item !== null && typeof item.id === 'string')
        .map(item => item.id)
        .sort();

      if (ids.length > 0) {
        sets[currentPath] = ids;
      }

      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const itemPath =
            typeof item.id === 'string'
              ? `${currentPath}[id=${item.id}]`
              : `${currentPath}[${index}]`;
          walk(item, itemPath);
        }
      });
      return;
    }

    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, child]) => {
        walk(child, `${currentPath}.${key}`);
      });
    }
  }

  if (resume && typeof resume === 'object') {
    walk(resume, prefix);
  }

  return sets;
}

function getIdSetMismatches(enContent, zhContent) {
  const enSets = getResumeIdSets(enContent);
  const zhSets = getResumeIdSets(zhContent);
  const paths = [...new Set([...Object.keys(enSets), ...Object.keys(zhSets)])].sort();

  return paths
    .map(path => {
      const enIds = enSets[path] ?? [];
      const zhIds = zhSets[path] ?? [];
      const missingInZh = enIds.filter(id => !zhIds.includes(id));
      const extraInZh = zhIds.filter(id => !enIds.includes(id));

      if (missingInZh.length === 0 && extraInZh.length === 0) {
        return null;
      }

      return {
        path,
        missingInZh,
        extraInZh,
      };
    })
    .filter(Boolean);
}

/**
 * Check for missing keys in the translation files
 */
const messageNamespaces = ['buttons', 'common', 'exportPdf', 'header', 'landing', 'sections'];
const resumePackageRequiredKeys = [
  'type',
  'version',
  'exportedAt',
  'locale',
  'resume',
  'changeSummary',
  'jdInsights',
  'jdTitle',
  'company',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateResumePackage(resumePackage, locale, filePath) {
  const missingKeys = resumePackageRequiredKeys.filter(key => !(key in resumePackage));
  const errors = [];

  if (missingKeys.length > 0) {
    errors.push(`missing keys: ${missingKeys.join(', ')}`);
  }
  if (resumePackage.type !== 'resume-tailor-draft') {
    errors.push('type must be "resume-tailor-draft"');
  }
  if (resumePackage.version !== 1) {
    errors.push('version must be 1');
  }
  if (resumePackage.locale !== locale) {
    errors.push(`locale must be "${locale}"`);
  }
  if (!resumePackage.resume || typeof resumePackage.resume !== 'object') {
    errors.push('resume must be an object');
  }
  if (!Array.isArray(resumePackage.changeSummary)) {
    errors.push('changeSummary must be an array');
  }
  if (!resumePackage.jdInsights || typeof resumePackage.jdInsights !== 'object') {
    errors.push('jdInsights must be an object');
  }

  if (errors.length > 0) {
    throw new Error(`${filePath}: ${errors.join('; ')}`);
  }
}

function readLocaleMessages(messagesDir, locale) {
  const localeDir = path.join(messagesDir, locale);

  if (!fs.existsSync(localeDir)) {
    throw new Error(`Locale message directory not found: messages/${locale}`);
  }

  const content = {};

  messageNamespaces.forEach(namespace => {
    const filePath = path.join(localeDir, `${namespace}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Message namespace not found: messages/${locale}/${namespace}.json`);
    }

    content[namespace] = readJson(filePath);
  });

  const resumeFilePath = path.join(localeDir, 'resume.json');

  if (!fs.existsSync(resumeFilePath)) {
    throw new Error(`Resume package not found: messages/${locale}/resume.json`);
  }

  const resumePackage = readJson(resumeFilePath);

  validateResumePackage(resumePackage, locale, `messages/${locale}/resume.json`);
  content.resume = resumePackage.resume;

  return content;
}

function checkTranslations() {
  const messagesDir = path.join(__dirname, '../messages');

  try {
    const enContent = readLocaleMessages(messagesDir, 'en');
    const zhContent = readLocaleMessages(messagesDir, 'zh');

    // Get all keys
    const enKeys = getKeysRecursively(enContent);
    const zhKeys = getKeysRecursively(zhContent);

    // Find missing keys (remove index differences)
    const normalizeKey = key => key.replace(/\[\d+\]/g, '[*]');
    const normalizedEnKeys = [...new Set(enKeys.map(normalizeKey))];
    const normalizedZhKeys = [...new Set(zhKeys.map(normalizeKey))];

    const missingKeys = normalizedEnKeys.filter(key => !normalizedZhKeys.includes(key));
    const extraKeys = normalizedZhKeys.filter(key => !normalizedEnKeys.includes(key));
    const idSetMismatches = getIdSetMismatches(enContent, zhContent);

    console.log('🔍 Translation Check Results:');
    console.log(`📊 English keys: ${normalizedEnKeys.length}`);
    console.log(`📊 Chinese keys: ${normalizedZhKeys.length}`);

    if (missingKeys.length > 0) {
      console.error('\n❌ Missing keys in Chinese translation:');
      missingKeys.forEach(key => {
        console.error(`   • ${key}`);
      });
    }

    if (extraKeys.length > 0) {
      console.warn('\n⚠️  Extra keys in Chinese translation (not in English):');
      extraKeys.forEach(key => {
        console.warn(`   • ${key}`);
      });
    }

    if (idSetMismatches.length > 0) {
      console.error('\n❌ Resume id mismatches between English and Chinese translations:');
      idSetMismatches.forEach(mismatch => {
        console.error(`   • ${mismatch.path}`);
        if (mismatch.missingInZh.length > 0) {
          console.error(`     Missing in Chinese: ${mismatch.missingInZh.join(', ')}`);
        }
        if (mismatch.extraInZh.length > 0) {
          console.error(`     Extra in Chinese: ${mismatch.extraInZh.join(', ')}`);
        }
      });
    }

    if (missingKeys.length === 0 && extraKeys.length === 0 && idSetMismatches.length === 0) {
      console.log('✅ All translation keys are in sync!');
      return true;
    } else {
      console.log('\n💡 Please update the Chinese translation file to match the English version.');
      return false;
    }
  } catch (error) {
    console.error('❌ Error parsing JSON files:', error.message);
    process.exit(1);
  }
}

// Run the check
const isValid = checkTranslations();
if (!isValid) {
  process.exit(1);
}
