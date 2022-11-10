import { type NextPage } from 'next'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// type Inputs = {
//   email: string
//   password: string
// }

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
})

type Schema = z.infer<typeof schema>

const Signup: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  // const onSubmit: SubmitHandler<Inputs> = (data) => console.log('hi', data)
  const onSubmit = (data: Schema) => console.log('hi', data)

  console.log('errors', errors)
  //console.log('watch', watch('example')) // watch input value by passing the name of it
  //console.log('watch', watch('email')) // watch input value by passing the name of it

  return (
    <div className='flex justify-center pt-10'>
      <div className='w-6/12 rounded-lg border-2 py-4'>
        <h1 className='flex w-full justify-center'>Signup</h1>
        <div className='flex w-full justify-center'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex w-6/12 flex-col justify-center'
          >
            <label htmlFor='email'>email</label>
            <input
              {...register('email', { required: 'This is required' })}
              className='rounded-md border-2 border-black'
              type='email'
              name='email'
              id='email'
              placeholder='Email'
            />
            <p>{errors.email?.message}</p>
            <label htmlFor='password'>Password</label>
            <input
              {...register('password', {
                required: 'This is required',
                minLength: {
                  value: 2,
                  message: 'Password must have at least 2 characters',
                },
              })}
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
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Signup
