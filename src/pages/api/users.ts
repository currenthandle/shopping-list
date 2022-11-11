// This is an API route to DELETE all user records in the User table

import { type NextApiRequest, type NextApiResponse } from 'next'

import { prisma } from '../../server/db/client'

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const users = await prisma.user.deleteMany()
    res.status(200).json(users)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default users
