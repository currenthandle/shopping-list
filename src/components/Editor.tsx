//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SyntheticEvent, useEffect, useState } from 'react'
import { TiDelete } from 'react-icons/ti'
import { trpc } from '../utils/trpc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ACTIONS, type Action } from './Shoppinglist'

interface EditorProps {
  name: string
  itemId: string
  dispatch: React.Dispatch<Action>
}

const Editor = ({ name, itemId, dispatch }: EditorProps) => {
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
      dispatch({
        type: ACTIONS.updateItem,
        payload: { id: itemId, name: getValues().name },
      })
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
    <div
      className='box-border'
      onClick={() => {
        if (!isEditing) {
          setIsEditing(true)
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        // if users click on a delete item icon then don't update the item
        const relatedTarget = e.relatedTarget as HTMLElement
        if (
          relatedTarget?.className.includes('delete-li') &&
          relatedTarget.id === itemId
        ) {
          return
        }

        mutate({
          name: e.target.value,
          itemId: itemId,
        })
        return
      }}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type='text'
            className='border-grey-300 rounded-md text-center'
            {...register('name')}
          />
        </form>
      ) : (
        name
      )}
    </div>
  )
}

export default Editor
