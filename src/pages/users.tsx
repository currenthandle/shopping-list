import { type NextPage } from 'next'
import { trpc } from '../utils/trpc'
const users: NextPage = () => {
  const { data, isLoading } = trpc.user.getAll.useQuery()
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1>Users</h1>
      {data?.map((user) => (
        <div key={user.id}>
          {user.name} + {user.password}
        </div>
      ))}
    </div>
  )
}
export default users
