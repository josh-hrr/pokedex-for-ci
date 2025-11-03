import React from 'react'
import { render, screen } from '@testing-library/react'
import axiosMock from 'axios'
import { act } from 'react'
import '@testing-library/jest-dom'
import App from '../src/App'

jest.mock('axios')

describe('<App />', () => {
  it('fetches data', async () => {
    axiosMock.get.mockResolvedValueOnce(
      {
        data: {
          results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/', name: 'bulbasaur', id: 1 }]
        }
      }
    )
    await act(async () => {
      render(<App />)
    })
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/?limit=784')
  })

  it('shows LoadingSpinner', async () => {
    // make axios.get return a pending promise so the component stays in loading state
    axiosMock.get.mockImplementationOnce(() => new Promise(() => {}))
    render(<App />)
    // spinner is rendered on initial render (before the effect resolves)
    expect(screen.getByAltText('Loading...')).toBeInTheDocument()
  })

  it('shows error', async () => {
    axiosMock.get.mockRejectedValueOnce(new Error())
    await act(async () => {
      render(<App />)
    })
    expect(screen.getByTestId('error')).toBeVisible()
  })
})
