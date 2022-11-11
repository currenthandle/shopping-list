import { Input } from 'postcss'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const itemRouter = router({
  // get all items associated with the logged in user
  getAllFromList: publicProcedure
    .input(
      z.object({
        shoppingListId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // const userEmail = ctx.session?.user?.email
        // if (!userEmail) {
        //   throw new Error('No user email')
        // }
        // const user = await ctx.prisma.user.findUnique({
        //   where: { email: userEmail },
        // })
        // const shoppingList = await ctx.prisma.shoppingList.findUnique({
        //   where: { userId: user?.id },
        // })
        const items = await ctx.prisma.item.findMany({
          where: { shoppingListId: input.shoppingListId },
        })
        return items
      } catch (error) {
        console.error(error)
      }
      return null
    }),
})
