import { Input } from 'postcss'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const itemRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        shoppingListId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('create mutation input', input)
        const item = await ctx.prisma.item.create({
          data: {
            name: input.name,
            shoppingListId: input.shoppingListId,
          },
        })
        return item
      } catch (error) {
        console.error(error)
      }
    }),
  // get all items associated with the logged in user
  getAllFromList: publicProcedure
    .input(
      z.object({
        shoppingListId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
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
