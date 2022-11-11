import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const shoppingListRouter = router({
  // get a single shopping list associated with the logged in user
  createShoppingList: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const shoppingList = await ctx.prisma.shoppingList.create({
          data: {
            userId: input.userId,
            //name: 'New Shopping List',
          },
        })
        return shoppingList
      } catch (error) {
        console.error(error)
      }
    }),
  // get a single shopping list associated with the logged in user
  getShoppingList: publicProcedure.query(async ({ ctx }) => {
    console.log('in router')
    try {
      //console.log('ctx', ctx)
      const userEmail = ctx.session?.user?.email
      if (!userEmail) {
        throw new Error('No user email')
      }
      console.log('userEmail', userEmail)
      const user = await ctx.prisma.user.findUnique({
        where: { email: userEmail },
      })
      console.log('user', user)
      const shoppingList = await ctx.prisma.shoppingList.findUnique({
        where: { userId: user?.id },
      })
      console.log('shoppingList', shoppingList)
      return shoppingList
    } catch (error) {
      console.error(error)
    }
  }),
})
