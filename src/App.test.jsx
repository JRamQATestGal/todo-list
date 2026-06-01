import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { fireEvent } from '@testing-library/dom'
import { describe, it, expect, vi } from 'vitest'
import App from './App.jsx'

const nextTick = () => Promise.resolve()

function mountApp() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(React.createElement(App))
  })

  return {
    container,
    unmount() {
      root.unmount()
      container.remove()
    },
  }
}

describe('App', () => {
  it('renders the title and initial tasks', async () => {
    const { container, unmount } = mountApp()
    await nextTick()

    expect(container.querySelector('h1')?.textContent).toBe('Todo List')
    expect(container.querySelector('input[aria-label="Add new task"]')).not.toBeNull()
    expect(container.querySelector('button')?.textContent).toMatch(/submit/i)

    const items = container.querySelectorAll('li')
    expect(items.length).toBe(3)
    expect(container.textContent).toContain('Walk the dog')
    expect(container.textContent).toContain('Water the plants')
    expect(container.textContent).toContain('Wash the dishes')

    unmount()
  })

  it('adds a new task when the form is submitted', async () => {
    const { container, unmount } = mountApp()
    await nextTick()

    const input = container.querySelector('input[aria-label="Add new task"]')
    const submitButton = container.querySelector('form button')

    expect(input).not.toBeNull()
    expect(submitButton).not.toBeNull()

    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    await nextTick()

    fireEvent.click(submitButton)
    await nextTick()

    expect(container.textContent).toContain('Buy groceries')
    expect(input.value).toBe('')
    expect(container.querySelectorAll('li').length).toBe(4)

    unmount()
  })

  it('does not add an empty task when the input is blank', async () => {
    const { container, unmount } = mountApp()
    await nextTick()
    const form = container.querySelector('form')

    expect(form).not.toBeNull()

    fireEvent.submit(form)
    await nextTick()

    expect(container.querySelectorAll('li').length).toBe(3)

    unmount()
  })

  it('removes a task when deletion is confirmed', async () => {
    const { container, unmount } = mountApp()
    await nextTick()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const firstDeleteButton = container.querySelector('li button')

    expect(firstDeleteButton).not.toBeNull()

    fireEvent.click(firstDeleteButton)
    await nextTick()

    expect(confirmSpy).toHaveBeenCalled()
    expect(container.textContent).not.toContain('Walk the dog')
    expect(container.querySelectorAll('li').length).toBe(2)

    confirmSpy.mockRestore()
    unmount()
  })

  it('keeps a task when deletion is cancelled', async () => {
    const { container, unmount } = mountApp()
    await nextTick()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const firstDeleteButton = container.querySelector('li button')

    expect(firstDeleteButton).not.toBeNull()

    fireEvent.click(firstDeleteButton)
    await nextTick()

    expect(confirmSpy).toHaveBeenCalled()
    expect(container.textContent).toContain('Walk the dog')
    expect(container.querySelectorAll('li').length).toBe(3)

    confirmSpy.mockRestore()
    unmount()
  })
})
