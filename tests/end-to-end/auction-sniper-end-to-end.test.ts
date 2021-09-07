import ApplicationRunner from './helpers/application-runner'
import FakeAuctionServer from './helpers/fake-auction-server'

let auction: FakeAuctionServer
let application: ApplicationRunner

jest.setTimeout(15000)

beforeEach(() => {
  auction =  new FakeAuctionServer('item-54321')
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

afterEach(async () => {
  auction.stop()
  await application.stop()
})

export {}