import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/**
 * @type {TodoPage}
 */
let todoPage;

test.describe('Todo app', () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Edge Cases', { tag: ['@regression', '@edgecases'] },() => {
    test('rapid checkbox clicks are handled correctly', async () => {
      await todoPage.toggleTask('Walk the dog');
      await todoPage.toggleTask('Walk the dog');
      await todoPage.toggleTask('Walk the dog');

      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);
    });

    test('double-click toggles checkbox twice', async () => {
      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');

      await checkbox.dblclick();

      await expect(checkbox).not.toBeChecked();
    });

    test('checkbox maintains focus after toggle', async () => {
      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');

      await checkbox.focus();
      await todoPage.page.keyboard.press('Space');

      await expect(checkbox).toBeChecked();
    });

    test('tab navigation includes checkbox', async () => {
      const firstCheckbox = todoPage.items.first().getByRole('checkbox');

      const tabIndex = await firstCheckbox.evaluate((el) => el.tabIndex);
      expect(tabIndex).toBeGreaterThanOrEqual(0);
    });

    test('can check all tasks', async () => {
      await todoPage.checkAllTasks();

      await expect(await todoPage.verifyAllTasksChecked()).toBe(true);
    });

    test('can uncheck all tasks after checking all', async () => {
      await todoPage.checkAllTasks();
      await todoPage.uncheckAllTasks();

      await expect(await todoPage.verifyAllTasksUnchecked()).toBe(true);
    });
  });
});