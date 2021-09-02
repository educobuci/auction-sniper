import ApplicationRunner from './helpers/application-runner'
import FakeAuctionServer from './helpers/fake-auction-server'

const auction = new FakeAuctionServer('item-54321')
const application = new ApplicationRunner()

test('Sniper joins auction until auction closes', async () => {
  auction.startSellingItem()
  application.startBiddingIn(auction)
  await auction.hasReceivedJoinRequestFromSniper()
  auction.announceClosed()
  await application.showsSniperHasLostAuction()
})

afterEach(() => {
  auction.stop()
  application.stop()
})

export {}