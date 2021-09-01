import Pusher from 'pusher-js'
import { AuctionStatus } from 'lib/AuctionStatus'
import { useCallback, useEffect, useState } from 'react'
import { config } from 'lib/config'

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY

export default function Home({ itemId }: { itemId: string }) {
  const [status, setStatus] = useState(AuctionStatus.Joining)

  const connectPusher = useCallback(async () => {
    const channelName = `private-${itemId}`
    const pusher = new Pusher(pusherApiKey, {
      authEndpoint: '/api/pusher/auth',
      cluster: config.cluster
    })
    const channel = pusher.subscribe(channelName)
    channel.bind('pusher:subscription_succeeded', () => {
      channel.trigger('client-message', { message: 'hello world' })
      setStatus(AuctionStatus.Lost)
    })
  }, [itemId])

  useEffect(() => { connectPusher() }, [connectPusher])

  return <div className="h-screen dark:bg-gray-900 dark:text-white p-4">
    <h1 className="text-3xl">Auction Sniper: { itemId }</h1>
    <div>{ status }</div>
  </div>
}

export function getServerSideProps({ query }) {
  return {
    props: { itemId: query['item-id'] }
  }
}