import { AuctionStatus, SniperListener } from '../core'

export default class SniperStateDisplayer implements SniperListener {
  ui: SniperUI

  constructor(ui: SniperUI) {
    this.ui = ui
  }

  sniperLost(): void {
    this.ui.showStatus(AuctionStatus.Lost)
  }

  sniperBidding(): void {
    this.ui.showStatus(AuctionStatus.Bidding)
  }
}

export interface SniperUI {
  showStatus(status: AuctionStatus): void
}