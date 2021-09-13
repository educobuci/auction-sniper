import { mock, MockProxy } from 'jest-mock-extended'
import { Auction } from '../../library/core/auction'
import { AuctionSniper, SniperListener, PriceSource, SniperSnapshot, SniperState } from '../../library/core'

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
    const snapshot = SniperSnapshot.joining(ITEM_ID).lost()
    expect(sniperListener.sniperStateChanged).toHaveBeenCalledWith(snapshot)
  })

  it('should bid higher and report bidding when new price arrives', () => {
    const price = 1001
    const increment = 25
    const bid = price + increment
    const snapshot = new SniperSnapshot(ITEM_ID, price, bid, SniperState.Bidding)
    sniper.currentPrice(price, increment, PriceSource.FromOtherBidder)
    expect(auction.bid).toHaveBeenCalledTimes(1)
    expect(auction.bid).toHaveBeenCalledWith(price + increment)
    expect(sniperListener.sniperStateChanged).toHaveBeenCalledWith(snapshot)
  })

  it('should report lost if auction closes when bidding', () => {
    var sniperState = null
    sniperListener.sniperStateChanged.mockImplementationOnce((snapshot) => {
      expect(snapshot.state).toEqual(SniperState.Bidding)
      sniperState = 'bidding'
    }).mockImplementationOnce(snapshot => {
      expect(snapshot.state).toEqual(SniperState.Lost)
      expect(sniperState).toEqual('bidding')
    })
    sniper.currentPrice(123, 45, PriceSource.FromOtherBidder)
    sniper.auctionClosed()
    expect(sniperListener.sniperStateChanged).toHaveBeenCalled()
  })

  it('should report winning when current price comes from sniper', () => {
    var sniperState = null
    sniperListener.sniperStateChanged.mockImplementationOnce((snapshot) => {
      expect(snapshot.state).toEqual(SniperState.Bidding)
      sniperState = 'bidding'
    }).mockImplementationOnce(snapshot => {
      expect(snapshot).toEqual(new SniperSnapshot(ITEM_ID, 135, 135, SniperState.Winning))
      expect(snapshot.state).toEqual(SniperState.Winning)
    })
    sniper.currentPrice(123, 12, PriceSource.FromOtherBidder)
    sniper.currentPrice(135, 45, PriceSource.FromSniper)
    expect(sniperListener.sniperStateChanged).toHaveBeenCalledTimes(2)
  })

  it('should report won if auction closes when winning', () => {
    var sniperState = null
    sniperListener.sniperStateChanged
      .mockImplementationOnce(() => sniperState = 'winning')
      .mockImplementationOnce(snapshot => {
        expect(sniperState).toEqual('winning')
        expect(snapshot.state).toEqual(SniperState.Won)
      })
    sniper.currentPrice(123, 45, PriceSource.FromSniper)
    sniper.auctionClosed()
    expect(sniperListener.sniperStateChanged).toHaveBeenCalled()
  })
})

export {}