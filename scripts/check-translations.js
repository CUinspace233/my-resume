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

/**
 * Check for missing keys in the translation files
 */
function checkTranslations() {
  const messagesDir = path.join(__dirname, '../messages');
  const enFilePath = path.join(messagesDir, 'en.json');
  const zhFilePath = path.join(messagesDir, 'zh.json');

  // Check if files exist
  if (!fs.existsSync(enFilePath)) {
    console.error('❌ English translation file not found: messages/en.json');
    process.exit(1);
  }

  if (!fs.existsSync(zhFilePath)) {
    console.error('❌ Chinese translation file not found: messages/zh.json');
    process.exit(1);
  }

  try {
    // Read and parse JSON files
    const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    const zhContent = JSON.parse(fs.readFileSync(zhFilePath, 'utf8'));

    // Get all keys
    const enKeys = getKeysRecursively(enContent);
    const zhKeys = getKeysRecursively(zhContent);

    // Find missing keys (remove index differences)
    const normalizeKey = key => key.replace(/\[\d+\]/g, '[*]');
    const normalizedEnKeys = [...new Set(enKeys.map(normalizeKey))];
    const normalizedZhKeys = [...new Set(zhKeys.map(normalizeKey))];

    const missingKeys = normalizedEnKeys.filter(key => !normalizedZhKeys.includes(key));
    const extraKeys = normalizedZhKeys.filter(key => !normalizedEnKeys.includes(key));

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

    if (missingKeys.length === 0 && extraKeys.length === 0) {
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
