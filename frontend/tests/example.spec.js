const { test, expect } = require('@playwright/test');

// Test 1
test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(
    page.getByRole('heading', { name: /Opportunity/i })
  ).toBeVisible();

  // Screenshot after page loads
  await page.screenshot({ path: 'homepage.png' });
});

// Test 2
test('Explore Careers button works', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.getByText('Explore Careers').click();

  // Optional: wait for navigation (important)
  await page.waitForLoadState('networkidle');

  // Screenshot AFTER click
  await page.screenshot({ path: 'after-click.png' });
});