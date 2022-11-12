//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { TiDelete } from 'react-icons/ti'
import { trpc } from '../utils/trpc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
interface EditorProps {
  name: string
  itemId: string
  refetchItems: () => Promise<void>
}

const Editor = ({ name, itemId, refetchItems }: EditorProps) => {
  const [isEditing, setIsEditing] = useState(false)
  //const [value, setValue] = useState('')

  const schema = z.object({
    name: z.string().min(2, { message: 'Too short' }),
  })

  type Schema = z.infer<typeof schema>

  const { handleSubmit, register, getValues, setFocus } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
    },
  })

  const { mutate } = trpc.item.updateItem.useMutation({
    onSuccess: async () => {
      refetchItems()
      setIsEditing(false)
    },
    onError: (error) => {
      console.error('error', error)
    },
  })

  const onSubmit = async (data: Schema) => {
    mutate({
      name: data.name,
      itemId: itemId,
    })
  }
  useEffect(() => {
    setFocus('name')
  }, [isEditing, setFocus])

  return (
    <span
      onClick={() => {
        setIsEditing(!isEditing)
      }}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type='text'
            className='border-grey-300 rounded-md border-2 text-center'
            {...register('name')}
            // onChange={(e) => setValue(e.target.value)}
          />
          {/* <button type='submit'>Save</button> */}
        </form>
      ) : (
        name
      )}
    </span>
  )
}

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
  const [editing, setEditing] = useState(false)

  async function handleDeleteClick(e) {
    deleteItem({ itemId })
  }
  function handleEditClick(e) {
    console.log('edit')
  }

  return (
    <li className='flex w-full justify-center pt-2'>
      <div className='flex w-6/12 justify-between'>
        <span>{i}) </span>
        {/* <span>{name}</span> */}
        <Editor name={name} itemId={itemId} refetchItems={refetchItems} />
        {/* a small round icon button for deleting items  */}
        <button onClick={handleDeleteClick}>
          <TiDelete className='h-6 w-6 text-red-500' />
        </button>
      </div>
    </li>
  )
}
export default ListItem
