//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TiDelete } from 'react-icons/ti'
import { trpc } from '../utils/trpc'

interface ListItemProps {
  name: string
  id: string
  i: number
  refetchItems: () => Promise<void>
}

const ListItem = ({ name, id: itemId, i, refetchItems }: ListItemProps) => {
  const { mutate: deleteItem } = trpc.item.deleteItem.useMutation({
    onSuccess: async () => {
      refetchItems()
    },
    onError: (error) => {
      console.error('error', error)
    },
  })

  async function handleClick(e) {
    deleteItem({ itemId })
  }
  // const handleClick = (e) => {
  //   console.log('clicked', id)
  // }

  return (
    <li className='flex w-full justify-center pt-2'>
      <div className='flex w-6/12 justify-between'>
        <span>{i}) </span>
        <span>{name}</span>
        {/* a small round icon button for deleting items  */}
        <button onClick={handleClick}>
          <TiDelete className='h-6 w-6 text-red-500' />
        </button>
      </div>
    </li>
  )
}
export default ListItem
