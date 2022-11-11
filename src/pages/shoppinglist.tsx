import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { trpc } from '../utils/trpc'

const ShoppingList: NextPage = () => {
  const { data: sessionData } = useSession()
  useEffect(() => {
    if (sessionData) {
      console.log('sessionData', Object.keys(sessionData))
    }
  })
  const { data, isLoading } = trpc.shoppingList.getShoppingList.useQuery()
  return <div>ShoppingList</div>
}
export default ShoppingList
