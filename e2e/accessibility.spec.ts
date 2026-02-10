import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav item
    await page.keyboard.press('Tab'); // Second nav item
    await page.keyboard.press('Tab'); // Third nav item
    
    // Press Enter on focused element
    await page.keyboard.press('Enter');
    
    // Should navigate
    await expect(page).toHaveURL(/\/(dashboard|applications)/);
  });

  test('should close modal with ESC', async ({ page }) => {
    await page.goto('/applications');
    
    // Open modal
    await page.click('text=Dodaj aplikację');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Press ESC
    await page.keyboard.press('Escape');
    
    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/applications');
    
    // Check search input
    const searchInput = page.locator('#search-applications');
    await expect(searchInput).toHaveAttribute('aria-label', 'Wyszukiwarka aplikacji');
    
    // Check sort buttons
    const sortGroup = page.locator('[role="group"][aria-label="Opcje sortowania"]');
    await expect(sortGroup).toBeVisible();
  });

  test('should have semantic HTML', async ({ page }) => {
    await page.goto('/applications');
    
    // Check main landmark
    await expect(page.locator('main#main-content')).toBeVisible();
    
    // Check list structure
    await expect(page.locator('[role="list"]')).toBeVisible();
  });
});


