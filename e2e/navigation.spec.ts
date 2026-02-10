import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    // Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Recruitment Tracker');
    
    // Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Applications
    await page.click('text=Moje Aplikacje');
    await expect(page).toHaveURL('/applications');
    await expect(page.locator('h1')).toContainText('Moje Aplikacje');
  });

  test('should have working skip to content link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Verify skip link is visible when focused
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
  });
});


