
import React from 'react'
import withAuth from '../../src/withAuth'
import Profile from '../../components/Profile/Profile'
import { useRouter } from 'next/router'
import { RootState } from '../../src/store'
import { useSelector } from 'react-redux'

export interface Profile {
    userName: string | undefined,
    profilePicture: string | undefined,
    dateOfBirth: string | undefined,
    noOfFriends: number | undefined,
}

function pages() {
    const { userId } = useSelector((store: RootState) => store.auth)
    const router = useRouter()
    router.replace(`/profile/${userId}`)

    return <>
        Loading...
    </>
}

export default withAuth(pages)

