import { mock, MockProxy } from 'jest-mock-extended'

import AuctionEventTranslator from '../../library/auction-event-translator'
import AuctionEventListener from '../../library/auction-event-listener'

describe('Auction event translator', () => {
  var listener: MockProxy<AuctionEventListener>
  var translator: AuctionEventTranslator

  beforeEach(() => {
    listener = mock<AuctionEventListener>()
    translator = new AuctionEventTranslator(listener)
  })

  it('should notify auction closed when the close event is received', () => {
    translator.processEvent('client-close', { })
    expect(listener.auctionClosed).toHaveBeenCalled()
  })

  it('should nofity bid details when a current price event is received', () => {
    translator.processEvent('client-price', { currentPrice: 192, increment: 7 })
    expect(listener.currentPrice).toHaveBeenCalledWith(192, 7)
  })
})

export { }