import {
  GetServerSideProps,
  GetServerSidePropsContext,
  type NextPage,
} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { trpc } from '../utils/trpc'
import { getServerAuthSession } from '../server/common/get-server-auth-session'
import { ShoppingList } from '../components/Shoppinglist'

const Home: NextPage = () => {
  return (
    <>
      {/* loutout button */}
      <button
        onClick={async (e) => {
          e.preventDefault()
          await signOut()
        }}
      >
        Log Out
      </button>
      <ShoppingList />
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
      props: {},
    }
  }

  return {
    props: {
      session,
    },
  }
}
