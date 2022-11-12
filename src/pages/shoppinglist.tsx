import { type NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useForm /*, type SubmitHandler */ } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ListItem from '../components/ListItem'

let count = 0
const schema = z.object({
  name: z.string().min(2, { message: 'Too short' }),
})

type Schema = z.infer<typeof schema>

const ShoppingList: NextPage = () => {
  const { handleSubmit, register } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  })
  //const { data: sessionData } = useSession()

  const { data: shoppingList, isLoading: loadingShoppingList } =
    trpc.shoppingList.getShoppingList.useQuery()

  const {
    data: items,
    isLoading: loadingItems,
    refetch: refetchItems,
  } = trpc.item.getAllFromList.useQuery({
    shoppingListId: shoppingList?.id || '',
  })

  const { mutate } = trpc.item.create.useMutation({
    onSuccess: async () => {
      refetchItems()
    },
    onError: (error) => {
      console.error('error', error)
    },
  })

  const onSubmit = async (data: Schema) => {
    mutate({
      name: data.name,
      shoppingListId: shoppingList?.id || '',
    })
  }

  if (loadingShoppingList) {
    return <div>Loading...</div>
  }
  count += 1
  return (
    <div className='flex justify-center pt-10'>
      <div className='w-6/12 rounded-lg border-2 py-4'>
        <p>COUNT: {count}</p>
        <h1 className='flex w-full justify-center'>
          ShoppingList: {shoppingList?.id}
        </h1>
        {loadingItems ? (
          <div className='flex w-full justify-center'>Loading Items...</div>
        ) : (
          <ol className='list-decimal' type='1'>
            {items?.map((item, i) => (
              <ListItem
                refetchItems={refetchItems}
                {...item}
                key={item.id}
                i={1 + i}
              />
            ))}
          </ol>
        )}
        <div className='flex w-full justify-center'>
          <form
            className='flex w-6/12 flex-col justify-center'
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor='name'></label>
            <input
              {...register('name')}
              className='rounded-md border-2 border-black'
              type='text'
              name='name'
            />
            <button type='submit'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default ShoppingList
