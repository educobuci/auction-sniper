import ApplicationRunner from './helpers/application-runner'
import FakeAuctionServer from './helpers/fake-auction-server'

let auction: FakeAuctionServer
let auction2: FakeAuctionServer
let application: ApplicationRunner

jest.setTimeout(15000)

beforeEach(() => {
  auction =  new FakeAuctionServer('item-54321')
  auction2 =  new FakeAuctionServer('item-65432')
  application =  new ApplicationRunner()
})

test('Sniper joins auction until auction closes', async () => {
  await auction.startSellingItem()

  await application.startBiddingIn(auction)
  await auction.hasReceivedJoinRequestFromSniper()

  auction.announceClosed()
  await application.showsSniperHasLostAuction()
})

test('Sniper makes a higher bid but loses', async () => {
  await auction.startSellingItem()

  await application.startBiddingIn(auction)
  await auction.hasReceivedJoinRequestFromSniper()

  auction.reportPrice(1000, 98, 'other bidder')
  await auction.hasReceivedBid(1098)

  await application.hasShownIsBidding()

  auction.announceClosed()
  await application.showsSniperHasLostAuction()
})

test('Sniper wins auction by bidding higher', async () => {
  await auction.startSellingItem()

  await application.startBiddingIn(auction)
  await auction.hasReceivedJoinRequestFromSniper()

  auction.reportPrice(1000, 98, 'other bidder')
  await application.hasShownSniperIsBidding(auction, 1000, 1098)

  auction.reportPrice(1098, 98, ApplicationRunner.SNIPER_ID)
  await application.hasShownSniperIsWinning(auction, 1098)

  auction.announceClosed()
  await application.showsSniperHasWonAuction(auction, 1098)
})

test.only('Sniper bids for multiple items', async () => {
  await auction.startSellingItem()
  await auction2.startSellingItem()

  await application.startBiddingIn(auction, auction2)
  await auction.hasReceivedJoinRequestFromSniper()
  await auction2.hasReceivedJoinRequestFromSniper()

  auction.reportPrice(1000, 98, 'other bidder')
  await auction.hasReceivedBid(1098)

  auction2.reportPrice(500, 21, 'other bidder')
  await auction2.hasReceivedBid(521)

  auction.reportPrice(1098, 97, ApplicationRunner.SNIPER_ID)
  auction2.reportPrice(521, 22, ApplicationRunner.SNIPER_ID)

  await application.hasShownSniperIsWinning(auction, 1098)
  await application.hasShownSniperIsWinning(auction2, 521)

  auction.announceClosed()
  auction2.announceClosed()

  await application.showsSniperHasWonAuction(auction, 1098)
  await application.showsSniperHasWonAuction(auction2, 521)
})

afterEach(async () => {
  auction.stop()
  auction2.stop()
  await application.stop()
})

export {}