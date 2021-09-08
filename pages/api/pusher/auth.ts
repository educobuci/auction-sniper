import type { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher'
import { config } from 'config'

const auth = (req: NextApiRequest, res: NextApiResponse) => {
  const pusher = new Pusher({ ...config })
  const socketId = req.body.socket_id
  const channel = req.body.channel_name
  const auth = pusher.authenticate(socketId, channel)
  res.status(200).json(auth)
}

export default auth