import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'
import { useForm, type SubmitHandler } from 'react-hook-form'

const ShoppingList: NextPage = () => {
  const { handleSubmit } = useForm()
  const { data: sessionData } = useSession()

  const { data: shoppingList, isLoading: loadingShoppingList } =
    trpc.shoppingList.getShoppingList.useQuery()

  const shoppingListId: string = shoppingList?.id || ''

  const [items, setItems] = useState([])
  useEffect(() => {
    const { data, isLoading } = trpc.item.getAllFromList.useQuery({
      shoppingListId,
    })
    setItems(data)
    //loadingItems = isLoading
  }, [shoppingListId])

  console.log('items', items)
  /*
  useEffect(() => {
    const shoppingListId = shoppingList?.id
    if (shoppingListId) {
      trpc.item.getAllFromList.useQuery({ shoppingListId })
    }
  }, [shoppingList])
*/

  const onSubmit = async () => {}
  console.log('shoppingList', shoppingList)
  if (loadingShoppingList) {
    return <div>Loading...</div>
  }
  return (
    <div className='w-6/12 rounded-lg border-2 py-4'>
      <h1 className='flex w-full justify-center'>ShoppingList</h1>
      <div className='flex w-full justify-center'>
        {items?.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
        <form
          className='flex w-6/12 flex-col justify-center'
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor='name'></label>
          <input
            className='rounded-md border-2 border-black'
            type='text'
            name='name'
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}
export default ShoppingList
