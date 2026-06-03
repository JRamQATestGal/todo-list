// Page Object for the Todo app
export class TodoPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.input = page.getByRole('textbox', { name: 'Add new task' });
    this.submit = page.getByRole('button', { name: 'Submit' });
    this.items = page.locator('tbody tr');
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

  async hasEmptyMessage() {
    return this.page.getByText('No tasks added').isVisible();
  }
}