import { mock, MockProxy } from 'jest-mock-extended'
import { Auction } from '../../library/core/auction'
import { AuctionSniper, SniperListener, PriceSource, SniperState } from '../../library/core'

describe('Auction sniper', () => {
  const ITEM_ID = 'item-321'

  let auction: MockProxy<Auction>
  let sniperListener: MockProxy<SniperListener>
  let sniper: AuctionSniper

  beforeEach(() => {
    auction = mock<Auction>()
    sniperListener = mock<SniperListener>()
    sniper = new AuctionSniper(ITEM_ID, auction, sniperListener)
  })

  it('should report lost when auction closes immediately', () => {
    sniper.auctionClosed()
    expect(sniperListener.sniperLost).toHaveBeenCalledTimes(1)
  })

  it('should bid higher and report bidding when new price arrives', () => {
    const price = 1001
    const increment = 25
    const bid = price + increment

    const state: SniperState = { itemId: ITEM_ID, lastPrice: price, lastBid: bid }
    
    sniper.currentPrice(price, increment, PriceSource.FromOtherBidder)
    expect(auction.bid).toHaveBeenCalledTimes(1)
    expect(auction.bid).toHaveBeenCalledWith(price + increment)
    expect(sniperListener.sniperBidding).toHaveBeenCalledWith(state)
  })

  it('should report lost if auction closes when bidding', () => {
    var sniperState = null
    sniperListener.sniperBidding.mockImplementationOnce(() => sniperState = 'bidding')
    sniperListener.sniperLost.mockImplementationOnce(() => expect(sniperState).toEqual('bidding'))
    sniper.currentPrice(123, 45, PriceSource.FromOtherBidder)
    sniper.auctionClosed()
    expect(sniperListener.sniperLost).toHaveBeenCalled()
  })

  it('should report winning when current price comes from sniper', () => {
    sniper.currentPrice(123, 45, PriceSource.FromSniper)
    expect(sniperListener.sniperWinning).toHaveBeenCalledTimes(1)
  })

  it('should report won if auction closes when winning', () => {
    var sniperState = null
    sniperListener.sniperWinning.mockImplementationOnce(() => sniperState = 'winning')
    sniperListener.sniperWon.mockImplementationOnce(() => expect(sniperState).toEqual('winning'))
    sniper.currentPrice(123, 45, PriceSource.FromSniper)
    sniper.auctionClosed()
    expect(sniperListener.sniperWon).toHaveBeenCalled()
  })
})

export {}