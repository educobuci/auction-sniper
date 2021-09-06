import { AuctionStatus } from 'library/AuctionStatus'
import { useCallback, useEffect, useState } from 'react'
import { dispatch, on, subscribe } from 'library/pusher/pusher-service'

export default function Home({ itemId }: { itemId: string }) {
  const [status, setStatus] = useState(AuctionStatus.Joining)

  const connect = useCallback(async () => {
    await subscribe(itemId)
    dispatch('join', { id: 'sniper' })
    on('close', () => setStatus(AuctionStatus.Lost))
    on('price', () => setStatus(AuctionStatus.Bidding))
  }, [itemId])

  useEffect(() => { connect() }, [ connect ])

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