import { expect } from '@playwright/test';

// Page Object for the Todo app
export class TodoPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Todo List' });
    this.table = page.getByRole('table');
    this.input = page.getByRole('textbox', { name: 'Add new task' });
    this.submit = page.getByRole('button', { name: 'Submit' });
    this.items = page.locator('tbody tr');
    this.emptyMessage = page.getByText('No tasks added');
  }

  async goto() {
    await this.page.goto('http://localhost:5173/');
  }

  async addTask(text) {
    await this.input.fill(text);
    await this.submit.click();
  }

  async deleteTask(label) {
    this.page.once('dialog', (d) => d.accept());
    await this.page.locator('tbody tr', { hasText: label }).getByRole('button', { name: 'Delete' }).click();
  }

  async deleteAll() {
    this.page.on('dialog', (d) => d.accept());
    let count = await this.items.count();
    while (count > 0) {
      await this.items.first().getByRole('button', { name: 'Delete' }).click();
      await this.page.waitForTimeout(50);
      count = await this.items.count();
    }
  }

  async taskCount() {
    return this.items.count();
  }

  taskRow(label) {
    return this.page.locator('tbody tr', { hasText: label });
  }

  async hasTask(label) {
    return this.taskRow(label).isVisible();
  }

  async hasNoTasks() {
    return (await this.taskCount()) === 0;
  }

  async hasEmptyMessage() {
    return this.emptyMessage.isVisible();
  }

    // Checkbox accessor methods
  async getCheckboxForTask(label) {
    return this.taskRow(label).getByRole('checkbox');
  }

  async isTaskCompleted(label) {
    const checkbox = await this.getCheckboxForTask(label);
    return checkbox.isChecked();
  }

  async toggleTask(label) {
    const checkbox = await this.getCheckboxForTask(label);
    await checkbox.click();
  }

  // Batch checkbox operations
  async checkAllTasks() {
    const checkboxes = this.items.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).click();
    }
  }

  async uncheckAllTasks() {
    const checkboxes = this.items.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).click();
    }
  }

  async getCheckboxCount() {
    return this.items.locator('input[type="checkbox"]').count();
  }

  async getCompletedCount() {
    const checkboxes = this.items.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    let completedCount = 0;
    for (let i = 0; i < count; i++) {
      if (await checkboxes.nth(i).isChecked()) {
        completedCount++;
      }
    }
    return completedCount;
  }

  // localStorage inspection
  async getStoredTasks() {
    return this.page.evaluate(() => {
      return JSON.parse(localStorage.getItem('todo_list_tasks'));
    });
  }

  async getTaskFromStorage(label) {
    const tasks = await this.getStoredTasks();
    return tasks.find(t => t.label === label);
  }

  // Batch verification methods
  async verifyAllTasksChecked() {
    const checkboxes = this.items.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (!isChecked) return false;
    }
    return true;
  }

  async verifyAllTasksUnchecked() {
    const checkboxes = this.items.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (isChecked) return false;
    }
    return true;
  }

  async expectActiveTaskStyling(label) {
      const taskRow = this.taskRow(label);
      const labelCell = taskRow.locator('td').nth(1);
      
      await expect(labelCell).toHaveClass(/.*text-gray-700.*/, { timeout: 2000 });
  } 

  async expectCompletedTaskStyling(label) {
    const taskRow = this.taskRow(label);
    const labelCell = taskRow.locator('td').nth(1);
    
    await expect(labelCell).toHaveClass(/.*line-through.*text-gray-400.*italic.*/, { timeout: 2000 });
  }

  // Simulated corrupted localStorage
  async simulateCorruptedStorage(tasks) {
    await this.page.evaluate((tasksData) => {
      localStorage.setItem('todo_list_tasks', JSON.stringify(tasksData));
    }, tasks);
  }
}