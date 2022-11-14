//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SyntheticEvent, useEffect, useState } from 'react'
import { TiDelete } from 'react-icons/ti'
import { trpc } from '../utils/trpc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ACTIONS, type Action } from '../pages/shoppinglist'
import Editor from './Editor'

interface ListItemProps {
  name: string
  id: string
  i: number
  dispatch: React.Dispatch<Action>
}

const ListItem = ({ name, id: itemId, i, dispatch }: ListItemProps) => {
  const { mutate: deleteItem } = trpc.item.deleteItem.useMutation({
    onSuccess: async (data) => {
      if (!data) {
        throw new Error('Could not delete item')
      }
      dispatch({ type: ACTIONS.deleteItem, payload: data.id })
    },
    onError: (error) => {
      console.error('error', error)
    },
  })

  async function handleDeleteClick() {
    deleteItem({ itemId })
  }

  return (
    <li className='flex h-10 w-full justify-center pt-2'>
      <div className='flex w-6/12 justify-between'>
        <span>{i}) </span>
        <Editor dispatch={dispatch} name={name} itemId={itemId} />
        {/* a small round icon button for deleting items  */}
        <button className='delete-li' id={itemId} onClick={handleDeleteClick}>
          <TiDelete className='h-6 w-6 text-red-500' />
        </button>
      </div>
    </li>
  )
}
export default ListItem
