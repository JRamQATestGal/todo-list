import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';

/**
 * @type {TodoPage}
 */
let todoPage;
const INITIAL_TASKS_COUNT = 3;

test.describe('Todo app - Regression Tests',{ tag: ['@regression'] }, () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Visual Styling', () => {
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

  test.describe('Edge Cases', () => {
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

  test.describe('Checkbox with Add/Delete Operations', () => {
    test('new task added when others are completed defaults to unchecked', async () => {
      await todoPage.toggleTask('Walk the dog');

      await todoPage.addTask('New task');

      await expect(await todoPage.isTaskCompleted('New task')).toBe(false);
    });

    test('adding task doesnt change state of existing checked tasks', async () => {
      await todoPage.toggleTask('Walk the dog');

      await todoPage.addTask('Another task');

      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);
    });

    test('can delete a completed task', async () => {
      await todoPage.toggleTask('Walk the dog');
      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);

      await todoPage.deleteTask('Walk the dog');

      await expect(await todoPage.hasTask('Walk the dog')).toBe(false);
    });

    test('deleting completed task doesnt affect other completed tasks', async () => {
      await todoPage.toggleTask('Walk the dog');
      await todoPage.toggleTask('Water the plants');

      await todoPage.deleteTask('Walk the dog');

      await expect(await todoPage.isTaskCompleted('Water the plants')).toBe(true);
      await expect(await todoPage.hasTask('Walk the dog')).toBe(false);
    });

    test('delete all works when some tasks are checked', async () => {
      await todoPage.toggleTask('Walk the dog');
      await todoPage.toggleTask('Water the plants');

      await todoPage.deleteAll();

      await expect(await todoPage.hasNoTasks()).toBe(true);
      await expect(todoPage.items).toHaveCount(0);
    });

    test('checkbox state remains consistent with multiple add/delete cycles', async () => {
      // Check a task
      await todoPage.toggleTask('Walk the dog');

      // Add new task
      await todoPage.addTask('Buy groceries');

      // Check the new task
      await todoPage.toggleTask('Buy groceries');

      // Delete an unchecked task
      await todoPage.deleteTask('Water the plants');

      // Verify checked states
      await expect(await todoPage.isTaskCompleted('Walk the dog')).toBe(true);
      await expect(await todoPage.isTaskCompleted('Buy groceries')).toBe(true);
      await expect(await todoPage.hasTask('Water the plants')).toBe(false);
    });
  });

  test.describe('Checkbox - Boundary Conditions', () => {
    test('checkbox works correctly with single task', async () => {
      await todoPage.deleteTask('Water the plants');
      await todoPage.deleteTask('Wash the dishes');

      const checkbox = await todoPage.getCheckboxForTask('Walk the dog');
      await checkbox.click();

      await expect(checkbox).toBeChecked();
    });

    test('checkbox visible styling applies correctly with single completed task', async () => {
      await todoPage.deleteTask('Water the plants');
      await todoPage.deleteTask('Wash the dishes');

      await todoPage.toggleTask('Walk the dog');

      await todoPage.expectCompletedTaskStyling('Walk the dog');
    });

    test('all checkboxes visible when table is populated', async () => {
      const checkboxCount = await todoPage.getCheckboxCount();

      await expect(checkboxCount).toBe(INITIAL_TASKS_COUNT);
    });

    test('completed count increases with each toggle', async () => {
      await expect(await todoPage.getCompletedCount()).toBe(0);

      await todoPage.toggleTask('Walk the dog');
      await expect(await todoPage.getCompletedCount()).toBe(1);

      await todoPage.toggleTask('Water the plants');
      await expect(await todoPage.getCompletedCount()).toBe(2);

      await todoPage.toggleTask('Walk the dog');
      await expect(await todoPage.getCompletedCount()).toBe(1);
    });
  });
});