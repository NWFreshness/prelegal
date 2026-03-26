import '@testing-library/jest-dom'

// Mock window.print — not available in jsdom
Object.defineProperty(window, 'print', {
  writable: true,
  value: jest.fn(),
})

// Mock scrollIntoView — not available in jsdom
Element.prototype.scrollIntoView = jest.fn()
