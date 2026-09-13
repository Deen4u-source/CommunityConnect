import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:8081',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server ./tests/e2e/static -p 8081 --silent',
    url: 'http://127.0.0.1:8081',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
