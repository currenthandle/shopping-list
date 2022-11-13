// right an API route the deletes all the items in the Item table

// src/pages/api/items.ts
import { type NextApiRequest, type NextApiResponse } from 'next'

import { prisma } from '../../server/db/client'

const items = async (req: NextApiRequest, res: NextApiResponse) => {
  // write a get all items query
  if (req.method === 'GET') {
    const items = await prisma.item.findMany()
    console.log('api/items.ts items', items)
    res.status(200).json(items)
  } else if (req.method === 'DELETE') {
    const items = await prisma.item.deleteMany()
    res.status(200).json(items)
  }
  // create new item
  else if (req.method === 'POST') {
    const item = await prisma.item.create({
      data: {
        name: req.body.name,
        shoppingListId: req.body.shoppingListId,
      },
    })
    res.status(200).json(item)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default items
