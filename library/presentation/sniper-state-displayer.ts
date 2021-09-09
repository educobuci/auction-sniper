import { AuctionStatus, SniperListener } from '../core'

export default class SniperStateDisplayer implements SniperListener {
  ui: SniperUI

  constructor(ui: SniperUI) {
    this.ui = ui
  }

  sniperWon(): void {
    this.ui.showStatus(AuctionStatus.Won)
  }

  sniperLost(): void {
    this.ui.showStatus(AuctionStatus.Lost)
  }

  sniperBidding(): void {
    this.ui.showStatus(AuctionStatus.Bidding)
  }

  sniperWinning(): void {
    this.ui.showStatus(AuctionStatus.Winning)
  }
}

export interface SniperUI {
  showStatus(status: AuctionStatus): void
}