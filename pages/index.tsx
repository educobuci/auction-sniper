import { useCallback, useEffect, useState } from 'react'
import { PusherAuction, AuctionEventTranslator, setEventTranslator, subscribeToChannel } from 'library/pusher'
import { AuctionSniper, AuctionStatus } from 'library/core'
import SniperStateDisplayer from 'library/presentation/sniper-state-displayer'

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