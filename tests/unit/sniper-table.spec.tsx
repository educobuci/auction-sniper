import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import SniperTable, { SniperTableRow } from '../../components/SniperTable'

describe('Sniper table', () => {
  const row: SniperTableRow = { id: 'id', lastPrice: '1000', lastBid: '1200', state: 'Bidding' }

  it('should have enough columns', () => {
    const { container } = render(<SniperTable rows={[row]} />)
    expect(container.querySelectorAll('td').length).toEqual(4)
  })

  it('should set sniper values in columns', () => {
    const { container } = render(<SniperTable rows={[row]} />)
    const cols = Array.from(container.querySelectorAll('td')).map(el => el.textContent)
    expect(cols).toEqual(Object.values(row))
  })

  it('should set sniper values in columns [SNAPSHOT]', () => {
    const table = renderer.create(<SniperTable rows={[row]} />)
    expect(table.toJSON()).toMatchSnapshot()
  })
})