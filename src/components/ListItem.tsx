import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    <li className='flex justify-center pt-2'>
      <span>{i}) </span>
      <span>{name}</span>
      {/* a small round icon button for deleting items  */}
      <button onClick={handleClick}>
        {/* <FontAwesomeIcon icon='fa-regular fa-circle-minus' /> */}
        <svg
          className='h-4 w-4 text-red-500'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
        >
          <circle cx='12' cy='12' r='10' />{' '}
          <line x1='15' y1='9' x2='9' y2='15' />{' '}
          <line x1='9' y1='9' x2='15' y2='15' />
        </svg>
      </button>
    </li>
  )
}
export default ListItem
