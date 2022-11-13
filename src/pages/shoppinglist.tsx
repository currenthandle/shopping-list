import { type NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useForm /*, type SubmitHandler */ } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ListItem from '../components/ListItem'
import { useEffect, useReducer } from 'react'
import { Item, ShoppingList as ShoppingListType } from '@prisma/client'

type Items = Record<string, Item>

const ACTIONS = {
  fetchItems: 'FETCH_ITEMS',
  addItem: 'ADD_ITEM',
}

interface State {
  items: Items[]
  shoppingList: ShoppingListType
}

interface Action {
  // use the values of actions object to set the type on Action to type: 'FETCH_ITEMS' | 'ADD_ITEM'
  //type: typeof actions[keyof typeof actions]
  type: 'FETCH_ITEMS' | 'ADD_ITEM'
  payload: Items[] | ShoppingListType
}

let count = 0
const ShoppingList: NextPage = () => {
  function reducer(state: State, action: Action) {
    console.log('state', state)
    console.log('action', action)
    //const items =     // console.log('items first', items)
    switch (action.type) {
      case ACTIONS.fetchItems:
        // check it action.paload is not an array
        // if it is not an array, log and error and return state
        if (!Array.isArray(action.payload)) {
          console.error(
            'action.payload is not an array, the payload is incorrect for this action'
          )
          return state
        }
        const newState = {
          ...state,
          items: action.payload?.reduce(
            (acc: Items, item: Item) => {
              console.log('typeof item', typeof item)
              console.log('item in reduce', item)
              acc[item.id] = item
              return acc
            },
            { images: {}, shoppingList: {} }
          ),
        }
        console.log('newState', newState)
        return newState
      case ACTIONS.addItem:
        return {
          ...state,
          //items: [...state.items, action.payload],
        }

      default:
        throw new Error()
    }
  }
  const schema = z.object({
    name: z.string().min(2, { message: 'Too short' }),
  })

  type Schema = z.infer<typeof schema>

  const { handleSubmit, register, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  })
  //const { data: sessionData } = useSession()

  const { data: shoppingList, isLoading: loadingShoppingList } =
    trpc.shoppingList.getShoppingList.useQuery()

  useEffect(() => {
    console.log('shoppingList', shoppingList)
  }, [shoppingList])

  const {
    data: _items,
    isLoading: loadingItems,
    refetch: refetchItems,
  } = trpc.item.getAllFromList.useQuery({
    shoppingListId: shoppingList?.id || '',
  })

  // const initialItemState = {
  //   items: _items || [],
  // }

  const [items, dispatch] = useReducer(reducer, {})

  useEffect(() => {
    // console.log('useEffect', _items)
    dispatch({ type: 'FETCH_ITEMS', payload: _items })
  }, [_items])

  const { mutate } = trpc.item.create.useMutation({
    onSuccess: async () => {
      refetchItems()
      reset()
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
          <ol className='flex list-decimal flex-col' type='1'>
            {/* {console.log('items from tsx', items)} */}
            {Object.values(items?.items || {}).map((item, i) => (
              // console.log('item!!!!!!!', item),
              <ListItem
                refetchItems={refetchItems}
                {...item}
                key={item?.id}
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
              className='rounded-md border-2 border-black text-center'
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
