import { mock, MockProxy } from 'jest-mock-extended'

import { AuctionEventTranslator } from '../../library/pusher'
import { AuctionEventListener, PriceSource } from '../../library/core'

describe('Auction event translator', () => {
  const SNIPER_ID = 'sniper'

  var listener: MockProxy<AuctionEventListener>
  var translator: AuctionEventTranslator

  beforeEach(() => {
    listener = mock<AuctionEventListener>()
    translator = new AuctionEventTranslator(SNIPER_ID, listener)
  })

  it('should notify auction closed when the close event is received', () => {
    translator.processEvent('client-close', { })
    expect(listener.auctionClosed).toHaveBeenCalled()
  })

  it('should nofity bid details when a current price event is received from other bidder', () => {
    translator.processEvent('client-price', { currentPrice: 192, increment: 7, bidder: 'Someone else' })
    expect(listener.currentPrice).toHaveBeenCalledWith(192, 7, PriceSource.FromOtherBidder)
  })

  it('should nofity bid details when a current price event is received from sniper', () => {
    translator.processEvent('client-price', { currentPrice: 234, increment: 5, bidder: SNIPER_ID })
    expect(listener.currentPrice).toHaveBeenCalledWith(234, 5, PriceSource.FromSniper)
  })
})

export { }