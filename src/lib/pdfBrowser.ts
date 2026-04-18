import { existsSync } from 'node:fs';
import chromium from '@sparticuz/chromium';
import { chromium as playwrightChromium, type Browser } from 'playwright-core';

const LOCAL_BROWSER_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

function getLocalExecutablePath() {
  const envPath = process.env.CHROMIUM_PATH ?? process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (envPath) {
    return envPath;
  }

  return LOCAL_BROWSER_CANDIDATES.find(candidate => existsSync(candidate));
}

export async function launchPdfBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const executablePath = await chromium.executablePath();

    return playwrightChromium.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  }

  const executablePath = getLocalExecutablePath();

  if (!executablePath) {
    throw new Error(
      'No Chromium executable found. Set CHROMIUM_PATH locally or deploy on Vercel with @sparticuz/chromium.'
    );
  }

  return playwrightChromium.launch({
    executablePath,
    headless: true,
  });
}
