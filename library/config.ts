const config =  {
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || process.env.PUSHER_APP_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || process.env.PUSHER_APP_CLUSTER,
  appId: process.env.PUSHER_APP_ID,
  secret: process.env.PUSHER_APP_SECRET,
}

export { config }