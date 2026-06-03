// @ts-check
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/**
 * @type {TodoPage}
 */
let todoPage;

test.describe('Todo app', () => {
  test.beforeEach(async ({ page }) => {
    // navigate and reload to ensure app state is reset between tests
    await page.goto('http://localhost:5173/');
    await page.reload();
    todoPage = new TodoPage(page);
  });
  test('loads initial tasks', async () => {
    await expect(todoPage.page.locator('#todo-list-heading')).toBeVisible();
    await expect(todoPage.page.getByRole('table')).toBeVisible();
    await expect(todoPage.page.locator('tbody tr')).toHaveCount(3);

    await expect(todoPage.page.getByText('Walk the dog')).toBeVisible();
    await expect(todoPage.page.getByText('Water the plants')).toBeVisible();
    await expect(todoPage.page.getByText('Wash the dishes')).toBeVisible();
  });

  test('can add a new task', async () => {
    await todoPage.addTask('Finish coding exercise');

    await expect(todoPage.page.locator('tbody tr')).toHaveCount(4);
    await expect(todoPage.page.getByText('Finish coding exercise')).toBeVisible();
  });

  test('can delete a task', async () => {
    await todoPage.deleteTask('Walk the dog');

    await expect(todoPage.page.getByText('Walk the dog')).not.toBeVisible();
    await expect(todoPage.page.locator('tbody tr')).toHaveCount(2);
  });

  test('can delete all tasks', async () => {
    await todoPage.deleteAll();

    await expect(await todoPage.taskCount()).toBe(0);
  });

  test('shows empty message when no tasks', async () => {
    await todoPage.deleteAll();

    await expect(todoPage.page.getByText('No tasks added')).toBeVisible();
  });
});
