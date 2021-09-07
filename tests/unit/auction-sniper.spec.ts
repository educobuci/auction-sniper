import { mock, MockProxy } from 'jest-mock-extended'
import { Auction } from '../../library/auction/ports'
import AuctionSniper from '../../library/auction-sniper/auction-sniper'
import { SniperListener } from '../../library/auction-sniper/ports'


describe('Auction sniper', () => {
  let auction: MockProxy<Auction>
  let sniperListener: MockProxy<SniperListener>
  let sniper: AuctionSniper

  beforeEach(() => {
    auction = mock<Auction>()
    sniperListener = mock<SniperListener>()
    sniper = new AuctionSniper(auction, sniperListener)
  })

  it('should report lost when auction closes', () => {
    sniper.auctionClosed()
    expect(sniperListener.sniperLost).toHaveBeenCalledTimes(1)
  })

  it('should bid higher and report bidding when new price arrives', () => {
    const price = 1001
    const increment = 25
    sniper.currentPrice(price, increment)
    expect(auction.bid).toHaveBeenCalledTimes(1)
    expect(auction.bid).toHaveBeenCalledWith(price + increment)
    expect(sniperListener.sniperBidding).toHaveBeenCalled()
  })
})

export {}