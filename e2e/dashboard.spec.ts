import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should display statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=Wszystkie aplikacje')).toBeVisible();
    await expect(page.locator('text=Oferty pracy')).toBeVisible();
    await expect(page.locator('text=W trakcie')).toBeVisible();
    await expect(page.locator('text=Średnia pensja')).toBeVisible();
  });

  test('should display new metrics', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
    await expect(page.locator('text=Success Rate')).toBeVisible();
    await expect(page.locator('text=Średni czas rekrutacji')).toBeVisible();
  });

  test('should load charts', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=Ładowanie wykresu')).not.toBeVisible();
  });

  test('should navigate to application details', async ({ page }) => {
    await page.goto('/dashboard');
    
    const firstApp = page.locator('.group').first();
    if (await firstApp.isVisible()) {
      await firstApp.click();
      await expect(page).toHaveURL(/\/applications\/\d+/);
    }
  });
});


