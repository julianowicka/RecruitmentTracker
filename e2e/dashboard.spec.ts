import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should display statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check main stats cards
    await expect(page.locator('text=Wszystkie aplikacje')).toBeVisible();
    await expect(page.locator('text=Oferty pracy')).toBeVisible();
    await expect(page.locator('text=W trakcie')).toBeVisible();
    await expect(page.locator('text=Średnia pensja')).toBeVisible();
  });

  test('should display new metrics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check new stats
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
    await expect(page.locator('text=Success Rate')).toBeVisible();
    await expect(page.locator('text=Średni czas rekrutacji')).toBeVisible();
  });

  test('should load charts', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for charts to load (lazy loaded)
    await page.waitForTimeout(2000);
    
    // Check if Suspense fallback is gone
    await expect(page.locator('text=Ładowanie wykresu')).not.toBeVisible();
  });

  test('should navigate to application details', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on recent application
    const firstApp = page.locator('.group').first();
    if (await firstApp.isVisible()) {
      await firstApp.click();
      await expect(page).toHaveURL(/\/applications\/\d+/);
    }
  });
});


