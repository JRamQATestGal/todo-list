import { test } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/** @type {TodoPage} */
let todoPage;

test.describe('Visual Styling', () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('completed task shows line-through styling', async () => {
    await todoPage.toggleTask('Walk the dog');

    await todoPage.expectCompletedTaskStyling('Walk the dog');
  });

  test('uncompleted task has normal styling', async () => {
    await todoPage.expectActiveTaskStyling('Walk the dog');
  });

  test('text styling reverts when unchecking a completed task', async () => {
    await todoPage.toggleTask('Walk the dog');
    await todoPage.expectCompletedTaskStyling('Walk the dog');

    await todoPage.toggleTask('Walk the dog');
    await todoPage.expectActiveTaskStyling('Walk the dog');
  });

  test('all completed tasks have consistent styling', async () => {
    await todoPage.checkAllTasks();

    for (const taskLabel of ['Walk the dog', 'Water the plants', 'Wash the dishes']) {
      await todoPage.expectCompletedTaskStyling(taskLabel);
    }
  });
});
