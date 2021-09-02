import ApplicationRunner from './helpers/application-runner'
import FakeAuctionServer from './helpers/fake-auction-server'

let auction: FakeAuctionServer
let application: ApplicationRunner

beforeEach(() => {
  auction =  new FakeAuctionServer('item-54321')
  application =  new ApplicationRunner()
})

test('Sniper joins auction until auction closes', async () => {
  auction.startSellingItem()
  application.startBiddingIn(auction)
  await auction.hasReceivedJoinRequestFromSniper()
  auction.announceClosed()
  await application.showsSniperHasLostAuction()
})

test('Sniper makes a higher bid but loses', async () => {
  auction.startSellingItem()
  application.startBiddingIn(auction)
  await auction.hasReceivedJoinRequestFromSniper()
})

afterEach(async () => {
  auction.stop()
  await application.stop()
})

export {}