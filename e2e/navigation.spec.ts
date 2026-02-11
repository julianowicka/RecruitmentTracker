import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Recruitment Tracker');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    await page.click('text=Moje Aplikacje');
    await expect(page).toHaveURL('/applications');
    await expect(page.locator('h1')).toContainText('Moje Aplikacje');
  });

  test('should have working skip to content link', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
  });
});


