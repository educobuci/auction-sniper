import Pusher, { Channel } from 'pusher-js'

const PUSHER_KEY = 'e42e4c2ccfd7b0128b0c'
const PUSHER_EVENT = 'client-message'
const PUSHER_CLUSTER = 'mt1'
const PUSHER_AUTH_ENDPOINT = 'http://localhost:9000/api/pusher/auth'
const PUSHER_SUBSCRIPTION_SUCCEEDED = 'pusher:subscription_succeeded'

export default class FakeAuctionServer {
  itemId: string
  pusher: Pusher
  channel: Channel
  messages: Array<any>
  isSubscribed: Promise<Boolean>

  constructor(itemId: string) {
    this.itemId = itemId
    this.messages = []
    Pusher.logToConsole = true
    this.pusher = new Pusher(PUSHER_KEY, {
      authEndpoint: PUSHER_AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER
    })
  }

  async startSellingItem() {
    const channelName = `private-${this.itemId}`
    this.channel = this.pusher.subscribe(channelName)
    return new Promise<Boolean>(resolve => this.channel.bind(PUSHER_SUBSCRIPTION_SUCCEEDED, resolve))
  }

  async hasReceivedJoinRequestFromSniper() {
    await expect(this.waitForEvent('client-join')).resolves.not.toThrow()
  }

  async announceClosed() {
    this.channel.trigger('client-close', {})
  }

  getItemId() {
    return this.itemId
  }

  reportPrice(currentPrice: number, increment: number, bidder: string) {
    this.channel.trigger('client-price', { currentPrice, increment, bidder })
  }

  async hasReceivedBid(price: number, sniperId: string) {
    await expect(this.waitForEvent('client-bid')).resolves.toEqual({ price, sniperId })
  }

  stop() {
    this.channel?.unbind_all()
    this.channel?.disconnect()
    this.pusher.disconnect()
  }

  private async waitForEvent(type: string): Promise<any> {
    return new Promise<any>(resolve => this.channel.bind(type, resolve))
  }
}