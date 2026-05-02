const { test, expect } = require('@playwright/test');

test('Services navigation works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByText('Services').click();
});

test('Careers navigation works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByText('Careers').click();
});