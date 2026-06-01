// Example tests using the TodoPage Page Object and custom fixture
import { test, expect } from '../fixtures/testFixtures.js';

test.describe('Todo app - Page Object', () => {
  test('adds a task via Page Object', async ({ todoPage }) => {
    await todoPage.addTask('PO: New task');
    await expect(todoPage.page.getByText('PO: New task')).toBeVisible();
  });

  test('deletes all tasks via Page Object', async ({ todoPage }) => {
    await todoPage.deleteAll();
    await expect(await todoPage.taskCount()).toBe(0);
    await expect(await todoPage.hasEmptyMessage()).toBe(true);
  });
});
