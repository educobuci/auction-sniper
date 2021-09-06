import { mock, MockProxy } from 'jest-mock-extended'
import AuctionSniper from '../../library/auction-sniper/auction-sniper'
import { SniperListener } from '../../library/auction-sniper/ports'


describe('Auction sniper', () => {
  let sniperListener: MockProxy<SniperListener>
  let sniper: AuctionSniper

  beforeEach(() => {
    sniperListener = mock<SniperListener>()
    sniper = new AuctionSniper(sniperListener)
  })

  it('should report lost when auction closes', () => {
    sniper.auctionClosed()
    expect(sniperListener.sniperLost).toHaveBeenCalledTimes(1)
  })
})

export {}