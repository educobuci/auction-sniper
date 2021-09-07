import { AuctionStatus } from 'library/auction-status'
import { useCallback, useEffect, useState } from 'react'
import { setEventTranslator, subscribeToChannel } from 'library/pusher/pusher-service'
import AuctionEventTranslator from 'library/auction-event-translator'
import AuctionSniper from 'library/auction-sniper/auction-sniper'
import SniperStateDisplayer from 'library/sniper-state-displayer'
import PusherAuction from 'library/pusher/pusher-auction'

export default function Home({ itemId }: { itemId: string }) {
  const [status, setStatus] = useState(AuctionStatus.Joining)

  const joinAuction = useCallback(async () => {
    const channel = await subscribeToChannel(`private-${itemId}`)
    const auction = new PusherAuction(channel)
    const displayer = new SniperStateDisplayer({ showStatus: setStatus })
    const sniper = new AuctionSniper(auction, displayer)
    setEventTranslator(new AuctionEventTranslator(sniper))
    auction.join()
  }, [itemId])

  useEffect(() => { joinAuction() }, [ joinAuction ])

  return <div className="h-screen dark:bg-gray-900 dark:text-white p-4">
    <h1 className="text-3xl">Auction Sniper: { itemId }</h1>
    <div id="status-label">{ status }</div>
  </div>
}

export function getServerSideProps({ query }) {
  return {
    props: { itemId: query['item-id'] }
  }
}