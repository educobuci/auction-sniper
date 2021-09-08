import { Auction } from 'library/core'
import { Channel } from 'pusher-js'

export class PusherAuction implements Auction {
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