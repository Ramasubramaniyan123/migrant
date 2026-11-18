import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoadingState, ErrorState, EmptyState } from './States'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('States', () => {
  it('LoadingState renders status', () => {
    wrap(<LoadingState label="Hold on" />)
    expect(screen.getByRole('status')).toHaveTextContent('Hold on')
  })
  it('ErrorState shows message and retry', () => {
    let called = 0
    wrap(<ErrorState message="Boom" onRetry={() => called++} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Boom')
    fireEvent.click(screen.getByText('Try again'))
    expect(called).toBe(1)
  })
  it('EmptyState renders title/description/action', () => {
    wrap(<EmptyState title="Nothing" description="desc" action={<button>Go</button>} />)
    expect(screen.getByText('Nothing')).toBeInTheDocument()
    expect(screen.getByText('desc')).toBeInTheDocument()
    expect(screen.getByText('Go')).toBeInTheDocument()
  })
})
