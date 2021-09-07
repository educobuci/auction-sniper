import { Auction } from 'library/auction/ports'
import { Channel } from 'pusher-js'

export default class PusherAuction implements Auction {
  channel: Channel

  constructor(channel: Channel) {
    this.channel = channel
  }

  join(): void {
    this.channel.trigger('client-join', {})
  }

  bid(amount: number): void {
    this.channel.trigger('client-bid', { amount })
  }
}