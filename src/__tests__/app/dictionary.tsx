import Modal from '@/src/app/ui/Modal'
import {render, screen} from '@testing-library/react'

it('should render the modal', () => {
  render(<Modal isOpen onClose={jest.fn()} title="Por favor, ingrese una palabra">Test children</Modal>)

  expect(screen.getByText('Por favor, ingrese una palabra')).toBeInTheDocument()
});


it('should close the modal when pressing the escape key', () => {
  const onClose = jest.fn()
  render(<Modal isOpen onClose={onClose}>Test children</Modal>)

  const event = new KeyboardEvent('keydown', { key: 'Escape' })
  window.dispatchEvent(event)

  expect(onClose).toHaveBeenCalled()
});
