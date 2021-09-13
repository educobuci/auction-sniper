import { SniperSnapshot, SniperListener, SniperState } from '../core'

export default class SniperStateDisplayer implements SniperListener {
  ui: SniperUI

  constructor(ui: SniperUI) {
    this.ui = ui
  }

  sniperWon(): void {
    this.ui.showStatus(SniperState.Won)
  }

  sniperLost(): void {
    this.ui.showStatus(SniperState.Lost)
  }

  sniperStateChanged(snapshot: SniperSnapshot): void {
    this.ui.showStatusChanged(snapshot)
  }

  sniperWinning(): void {
    this.ui.showStatus(SniperState.Winning)
  }
}

export interface SniperUI {
  showStatus(state: SniperState): void
  showStatusChanged(snapshot: SniperSnapshot): void
}