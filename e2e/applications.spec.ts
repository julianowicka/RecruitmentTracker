import { test, expect } from '@playwright/test';

test.describe('Application CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/applications');
  });

  test('should create a new application', async ({ page }) => {
    // Click "Dodaj aplikację" button
    await page.click('text=Dodaj aplikację');
    
    // Modal should be visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Fill form
    await page.fill('#company', 'Test Company E2E');
    await page.fill('#role', 'Senior Developer');
    await page.selectOption('#status', 'applied');
    await page.fill('#link', 'https://test.com/job');
    await page.fill('#salaryMin', '15000');
    await page.fill('#salaryMax', '20000');
    
    // Add tags
    await page.click('text=Remote');
    await page.click('text=Urgent');
    
    // Set rating
    const stars = page.locator('button:has-text("⭐")');
    await stars.nth(3).click(); // 4 stars
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for modal to close and card to appear
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Test Company E2E')).toBeVisible();
  });

  test('should search applications', async ({ page }) => {
    // Type in search
    const searchInput = page.locator('#search-applications');
    await searchInput.fill('Test Company');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // Verify results
    const resultCount = page.locator('[role="list"] [role="listitem"]');
    await expect(resultCount).toHaveCount({ timeout: 5000 });
  });

  test('should filter by status', async ({ page }) => {
    // Click on status filter
    await page.click('text=Rozmowa HR');
    
    // Verify URL changed
    await expect(page).toHaveURL(/status=hr_interview/);
  });

  test('should sort applications', async ({ page }) => {
    // Click sort by company
    await page.click('button:has-text("🏢 Firma")');
    
    // Verify button is active
    await expect(page.locator('button:has-text("🏢 Firma")')).toHaveClass(/bg-blue-500/);
  });

  test('should export applications', async ({ page }) => {
    // Click export button
    await page.click('text=Eksportuj');
    
    // Menu should be visible
    await expect(page.locator('text=Eksportuj do CSV')).toBeVisible();
    
    // Note: Actual download testing would require additional setup
  });

  test('should edit application', async ({ page }) => {
    // Find and click edit button on first card
    const editButton = page.locator('button:has-text("Edytuj")').first();
    await editButton.click();
    
    // Modal should be visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('Edytuj');
    
    // Change company name
    const companyInput = page.locator('#company');
    await companyInput.clear();
    await companyInput.fill('Updated Company');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for update
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Updated Company')).toBeVisible();
  });

  test('should delete application', async ({ page }) => {
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete on first card
    const deleteButton = page.locator('button:has([class*="Trash"])').first();
    await deleteButton.click();
    
    // Wait for deletion
    await page.waitForTimeout(500);
  });
});


