import { router } from '../trpc'
import { authRouter } from './auth'
import { exampleRouter } from './example'
import { itemRouter } from './item'
import { shoppingListRouter } from './shoppingList'
import { userRouter } from './user'

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  user: userRouter,
  shoppingList: shoppingListRouter,
  item: itemRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
