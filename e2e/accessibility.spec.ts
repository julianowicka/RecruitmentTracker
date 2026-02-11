import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    await page.keyboard.press('Enter');
    
    await expect(page).toHaveURL(/\/(dashboard|applications)/);
  });

  test('should close modal with ESC', async ({ page }) => {
    await page.goto('/applications');
    
    await page.click('text=Dodaj aplikację');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    await page.keyboard.press('Escape');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/applications');
    
    const searchInput = page.locator('#search-applications');
    await expect(searchInput).toHaveAttribute('aria-label', 'Wyszukiwarka aplikacji');
    
    const sortGroup = page.locator('[role="group"][aria-label="Opcje sortowania"]');
    await expect(sortGroup).toBeVisible();
  });

  test('should have semantic HTML', async ({ page }) => {
    await page.goto('/applications');
    
    await expect(page.locator('main#main-content')).toBeVisible();
    
    await expect(page.locator('[role="list"]')).toBeVisible();
  });
});


