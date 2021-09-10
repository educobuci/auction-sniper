import { SniperState } from ".";

export interface SniperListener {
  sniperLost(): void
  sniperBidding(state: SniperState): void
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

export enum AuctionStatus {
  Joining = 'Joining',
  Lost = 'Lost',
  Bidding = 'Bidding',
  Winning = 'Winning',
  Won = 'Won'
}