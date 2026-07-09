import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/**
 * @type {TodoPage}
 */
let todoPage;
const INITIAL_TASKS_COUNT = 3;

test.describe('Todo app - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Smoke Testing', { tag: ['@smoke'] },() => {
    test.describe('Initial Load', () => {
      test('has title', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle("To-Do List");
    });

      test('loads initial tasks', async () => {
          await expect(todoPage.heading).toBeVisible();
          await expect(todoPage.table).toBeVisible();
          await expect(todoPage.items).toHaveCount(INITIAL_TASKS_COUNT);

          await expect(await todoPage.hasTask('Walk the dog')).toBe(true);
          await expect(await todoPage.hasTask('Water the plants')).toBe(true);
          await expect(await todoPage.hasTask('Wash the dishes')).toBe(true);
      });
    });

    test('can add a new task', async () => {
      await todoPage.addTask('Finish coding exercise');

      await expect(todoPage.items).toHaveCount(INITIAL_TASKS_COUNT + 1);
      await expect(await todoPage.hasTask('Finish coding exercise')).toBe(true);
    });

    test('can delete a task', async () => {
      await todoPage.deleteTask('Walk the dog');

      await expect(await todoPage.hasTask('Walk the dog')).toBe(false);
      await expect(todoPage.items).toHaveCount(2);
    });

    test('can delete all tasks', async () => {
      await todoPage.deleteAll();

      await expect(await todoPage.taskCount()).toBe(0);
    });

    test('shows empty message when no tasks', async () => {
      await todoPage.deleteAll();

      await expect(await todoPage.hasNoTasks()).toBe(true);
      await expect(await todoPage.hasEmptyMessage()).toBe(true);
    });

     test('can mark a task as completed by clicking checkbox', async () => {
      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');

      await expect(checkbox).not.toBeChecked();
      await checkbox.click();
      await expect(checkbox).toBeChecked();
    });

    test('can uncheck a completed task', async () => {
      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');

      await checkbox.click();
      await expect(checkbox).toBeChecked();
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    });

    test('checkbox has proper accessibility label', async () => {
      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');

      await expect(checkbox).toHaveAttribute('aria-label', /Mark "Walk the dog" as completed/);
    });

    test('checkbox is keyboard accessible', async () => {
      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');

      await checkbox.focus();
      await expect(checkbox).toBeFocused();

      await todoPage.page.keyboard.press('Space');
      await expect(checkbox).toBeChecked();
    });
  });
});