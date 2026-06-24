// @ts-check
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/**
 * @type {TodoPage}
 */
let todoPage;
const INITIAL_TASKS_COUNT = 3;

test.describe('Todo app', () => {
    /**
     * @type {TodoPage}
     */
    test.beforeEach(async ({ page }) => {
        // navigate and reload to ensure app state is reset between tests
        todoPage = new TodoPage(page);
        await todoPage.goto();
        await page.evaluate(() => localStorage.clear()); 
        await page.reload();
    });

    test('loads initial tasks', async () => {
            await expect(todoPage.heading).toBeVisible();
        await expect(todoPage.table).toBeVisible();
        await expect(todoPage.items).toHaveCount(INITIAL_TASKS_COUNT);

        await expect(await todoPage.hasTask('Walk the dog')).toBe(true);
        await expect(await todoPage.hasTask('Water the plants')).toBe(true);
        await expect(await todoPage.hasTask('Wash the dishes')).toBe(true);
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
});
