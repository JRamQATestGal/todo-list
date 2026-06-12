// Example tests using the TodoPage Page Object and custom fixture
import { test, expect } from '../fixtures/testFixtures.js';

test.describe('Todo app - Page Object', () => {
  test('adds a task via Page Object', async ({ todoPage }) => {
    await todoPage.addTask('PO: New task');
    await expect(await todoPage.hasTask('PO: New task')).toBe(true);
  });

  test('deletes all tasks via Page Object', async ({ todoPage }) => {
    await todoPage.deleteAll();
    await expect(await todoPage.hasNoTasks()).toBe(true);
    await expect(await todoPage.hasEmptyMessage()).toBe(true);
  });
});
