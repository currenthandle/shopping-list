import { router } from '../trpc'
import { authRouter } from './auth'
import { exampleRouter } from './example'
import { shoppingListRouter } from './shoppingList'
import { userRouter } from './user'

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  user: userRouter,
  shoppingList: shoppingListRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
