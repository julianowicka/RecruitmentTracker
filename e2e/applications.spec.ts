import { test, expect } from '@playwright/test';

test.describe('Application CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/applications');
  });

  test('should create a new application', async ({ page }) => {
    await page.click('text=Dodaj aplikację');
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    await page.fill('#company', 'Test Company E2E');
    await page.fill('#role', 'Senior Developer');
    await page.selectOption('#status', 'applied');
    await page.fill('#link', 'https://test.com/job');
    await page.fill('#salaryMin', '15000');
    await page.fill('#salaryMax', '20000');
    
    await page.click('text=Remote');
    await page.click('text=Urgent');
    
    const stars = page.locator('button:has-text("⭐")');
    await stars.nth(3).click();
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Test Company E2E')).toBeVisible();
  });

  test('should search applications', async ({ page }) => {
    const searchInput = page.locator('#search-applications');
    await searchInput.fill('Test Company');
    
    await page.waitForTimeout(500);
    
    const resultCount = page.locator('[role="list"] [role="listitem"]');
    await expect(resultCount).toHaveCount({ timeout: 5000 });
  });

  test('should filter by status', async ({ page }) => {
    await page.click('text=Rozmowa HR');
    
    await expect(page).toHaveURL(/status=hr_interview/);
  });

  test('should sort applications', async ({ page }) => {
    await page.click('button:has-text("🏢 Firma")');
    
    await expect(page.locator('button:has-text("🏢 Firma")')).toHaveClass(/bg-blue-500/);
  });

  test('should export applications', async ({ page }) => {
    await page.click('text=Eksportuj');
    
    await expect(page.locator('text=Eksportuj do CSV')).toBeVisible();
    
  });

  test('should edit application', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edytuj")').first();
    await editButton.click();
    
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('Edytuj');
    
    const companyInput = page.locator('#company');
    await companyInput.clear();
    await companyInput.fill('Updated Company');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Updated Company')).toBeVisible();
  });

  test('should delete application', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    const deleteButton = page.locator('button:has([class*="Trash"])').first();
    await deleteButton.click();
    
    await page.waitForTimeout(500);
  });
});


