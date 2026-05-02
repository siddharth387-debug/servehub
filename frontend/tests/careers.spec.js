const { test, expect } = require('@playwright/test');

test('Explore Careers button works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByText('Explore Careers').click();
});