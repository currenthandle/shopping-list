import { z } from 'zod'

import bcrypt from 'bcrypt'
import { router, publicProcedure } from '../trpc'

export const userRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.user.findMany()
      return users
    } catch (error) {
      console.log(error)
    }
  }),
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('input', input)
      const SALT_ROUNDS = 10

      // create new shopping list
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: bcrypt.hashSync(input.password, SALT_ROUNDS),
          },
        })
        // create new shopping list with userId
        try {
          await ctx.prisma.shoppingList.create({
            data: {
              userId: user.id,
            },
          })
        } catch (error) {
          console.error(error)
        }

        return user
      } catch (error) {
        console.error(error)
      }
    }),
})
