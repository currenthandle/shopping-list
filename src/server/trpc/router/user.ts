import { z } from 'zod'

import bcrypt from 'bcrypt'
import { router, publicProcedure } from '../trpc'

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const SALT_ROUNDS = 10
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: bcrypt.hashSync(input.password, SALT_ROUNDS),
          },
        })
        return user
      } catch (error) {
        console.error(error)
      }
    }),
})
