// Custom fixtures that provide a `todoPage` Page Object
import { test as baseTest, expect as baseExpect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage.js';

const test = baseTest.extend({
  todoPage: async ({ page }, run) => {
    const todo = new TodoPage(page);
    await todo.goto();
    await run(todo);
  },
});

export { test, baseExpect as expect };