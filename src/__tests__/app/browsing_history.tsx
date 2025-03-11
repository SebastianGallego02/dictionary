import BrowsingHistory from '@/src/app/browsing_history/page'
import {render, screen} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

  render(
    <BrowserRouter>
      <BrowsingHistory />
    </BrowserRouter>
  )
    
it('should close the browsing history when pressing the escape key', () => {
  const onClose = jest.fn()
  render(<BrowsingHistory />)

  const event = new KeyboardEvent('keydown', { key: 'Escape' })
  window.dispatchEvent(event)

  expect(onClose).toHaveBeenCalled()
});

it('should render the browsing history', () => {
  render(<BrowsingHistory />)

  expect(screen.getByText('Historial de navegación')).toBeInTheDocument()
});