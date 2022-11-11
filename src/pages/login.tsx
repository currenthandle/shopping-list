import { type NextPage } from 'next'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { trpc } from '../utils/trpc'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

const schema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(2, { message: 'Too short' }),
})

type Schema = z.infer<typeof schema>

//type SuccessInput extends Schema

const Login: NextPage = () => {
  const router = useRouter()
  const { mutate } = trpc.user.create.useMutation({
    onSuccess: async (data) => {
      const formValues = getValues()
      try {
        const resp = await signIn('credentials', {
          // email: data?.email,
          // password: data?.password,
          email: formValues.email,
          password: formValues.password,
          redirect: false,
        })
        if (resp?.ok) {
          router.push('/')
        } else {
          console.error('error', resp)
        }
      } catch (error) {
        console.error('error', error)
      }
    },
    onError: (error) => {
      console.error('error', error)
    },
  })

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = async (/*data: Schema*/) => {
    const formValues = getValues()
    try {
      const resp = await signIn('credentials', {
        // email: data?.email,
        // password: data?.password,
        email: formValues.email,
        password: formValues.password,
        redirect: false,
      })
      if (resp?.ok) {
        router.push('/')
      } else {
        console.error('error', resp)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  console.log('errors', errors)

  return (
    <div className='flex justify-center pt-10'>
      <div className='w-6/12 rounded-lg border-2 py-4'>
        <h1 className='flex w-full justify-center'>Login</h1>
        <div className='flex w-full justify-center'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex w-6/12 flex-col justify-center'
          >
            <label htmlFor='email'>email</label>
            <input
              {...register('email')}
              className='rounded-md border-2 border-black'
              type='email'
              name='email'
              id='email'
              placeholder='Email'
            />
            <p>{errors.email?.message}</p>
            <label htmlFor='password'>Password</label>
            <input
              {...register('password')}
              className='rounded-md border-2 border-black'
              type='password'
              name='password'
              id='password'
              placeholder='Password'
            />
            <p>{errors.password?.message}</p>

            <div className='flex justify-center'>
              <button
                className='mt-4 w-4/12 rounded-md border-2 border-black'
                type='submit'
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login
