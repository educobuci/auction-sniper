import { SniperSnapshot } from '.'

export interface SniperListener {
  sniperLost(): void
  sniperStateChanged(snapshot: SniperSnapshot): void
  sniperWinning(): void
  sniperWon(): void
}

export interface AuctionEventListener {
  auctionClosed(): void
  currentPrice(price: number, increment: number, source: PriceSource): void
}

export enum PriceSource {
  FromSniper,
  FromOtherBidder,
}

export enum SniperState {
  Joining = 'Joining',
  Lost = 'Lost',
  Bidding = 'Bidding',
  Winning = 'Winning',
  Won = 'Won'
}