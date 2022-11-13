import { type NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { useForm /*, type SubmitHandler */ } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ListItem from '../components/ListItem'
import { useEffect, useReducer } from 'react'
import { Item, ShoppingList as ShoppingListType } from '@prisma/client'

type ItemRecords = Record<string, Item>
// type ItemRecords = {
//   [key: string]: Item
// }

const testIR: ItemRecords = {
  '1': {
    id: '1',
    name: 'test',
    shoppingListId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  '4': {
    id: '1',
    name: 'test',
    shoppingListId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

const ACTIONS = {
  fetchItems: 'FETCH_ITEMS',
  addItem: 'ADD_ITEM',
  fetchShoppingList: 'FETCH_SHOPPING_LIST',
  updateItem: 'UPDATE_ITEM',
}

type State = {
  items: ItemRecords
  shoppingList: ShoppingListType
}

type UpateItemPayload = {
  id: string
  name: string
}

export type Action = {
  // use the values of actions object to set the type on Action to type: 'FETCH_ITEMS' | 'ADD_ITEM'
  //type: typeof actions[keyof typeof actions]
  //type: 'FETCH_ITEMS' | 'ADD_ITEM'
  type: string
  payload: Item[] | ShoppingListType | UpateItemPayload
}

let count = 0
const initialState: State = {
  items: {} as ItemRecords,
  shoppingList: {} as ShoppingListType,
}
function reducer(state: State, action: Action): State {
  console.log('state', state)
  console.log('action', action)
  switch (action.type) {
    case ACTIONS.updateItem: {
      const { id, name } = action.payload as UpateItemPayload
      const item = state.items[id]
      const newItem = { ...item, name }
      const newItems = { ...state.items, [id]: newItem }
      return { ...state, items: newItems as ItemRecords }
    }
    case ACTIONS.fetchShoppingList:
      return {
        ...state,
        shoppingList: action.payload as ShoppingListType,
      }
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
        items: action.payload?.reduce<ItemRecords>((acc, item): ItemRecords => {
          // console.log('typeof item', typeof item)
          // console.log('item in reduce', item)
          acc[item.id] = item
          return acc
        }, {}),
      }
      console.log('newState', newState)
      return newState
    case ACTIONS.addItem:
      return {
        ...state,
        //items: [...state.items, action.payload],
      }

    default:
      //throw new Error()
      return state
  }
}
const ShoppingList: NextPage = () => {
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

  const { data: _shoppingList, isLoading: loadingShoppingList } =
    trpc.shoppingList.getShoppingList.useQuery()

  const {
    data: _items,
    isLoading: loadingItems,
    refetch: refetchItems,
  } = trpc.item.getAllFromList.useQuery({
    shoppingListId: _shoppingList?.id || '',
  })

  const [state, dispatch] = useReducer(reducer, initialState)
  const { items, shoppingList } = state

  useEffect(() => {
    dispatch({
      type: ACTIONS.fetchShoppingList,
      payload: _shoppingList as ShoppingListType,
    })
  }, [_shoppingList])

  useEffect(() => {
    dispatch({ type: 'FETCH_ITEMS', payload: _items as Item[] })
  }, [_items])

  const { mutate } = trpc.item.create.useMutation({
    onSuccess: async () => {
      console.log('onSuccess')
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
            {Object.values(items || {}).map((item, i) => (
              // console.log('item!!!!!!!', item),
              <ListItem
                // refetchItems={refetchItems}
                dispatch={dispatch}
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
