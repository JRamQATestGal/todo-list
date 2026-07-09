import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/**
 * @type {TodoPage}
 */
let todoPage;

test.describe('Todo app - Persistence Tests', () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Persistence', () => {

    test('can add a new task and the new task stays after reload', async () => {
      await todoPage.addTask('Finish coding exercise');
      await expect(await todoPage.hasTask('Finish coding exercise')).toBe(true);

      await todoPage.page.reload();

      await expect(await todoPage.hasTask('Finish coding exercise')).toBe(true);
    });

     test('can delete a task and the deleted task stays deleted after reload', async () => {
      await todoPage.deleteTask('Walk the dog');

      await expect(await todoPage.hasTask('Walk the dog')).toBe(false);
      await todoPage.page.reload();

      await expect(await todoPage.hasTask('Walk the dog')).toBe(false);
    });
    
    test('checkbox state persists after page reload', async () => {
      await todoPage.toggleTask('Walk the dog');
      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);

      await todoPage.page.reload();

      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);
    });

    test('multiple checkbox states persist together', async () => {
      await todoPage.toggleTask('Walk the dog');
      await todoPage.toggleTask('Water the plants');

      await todoPage.page.reload();

      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);
      await expect(await todoPage.isTaskCompleted('Water the plants')).toBe(true);
      await expect(await todoPage.isTaskCompleted('Wash the dishes')).toBe(false);
    });

    test('checkbox state persists across multiple page reloads', async () => {
      await todoPage.toggleTask('Walk the dog');

      for (let i = 0; i < 3; i++) {
        await todoPage.page.reload();
        await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);
      }
    });

    test('localStorage updates immediately after checkbox toggle', async () => {
      await todoPage.toggleTask('Walk the dog');

      const storedTask = await todoPage.getTaskFromStorage('Walk the dog');
      expect(storedTask.completed).toBe(true);
    });

    test('corrupted localStorage gracefully defaults uncompleted tasks', async () => {
      await todoPage.simulateCorruptedStorage([
        { id: 'task-1', label: 'Walk the dog' } // Missing 'completed' property
      ]);

      await todoPage.page.reload();

      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');
      await expect(checkbox).not.toBeChecked();
    });
  });

});