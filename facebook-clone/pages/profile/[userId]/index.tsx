import React, { useEffect, useRef, useState } from 'react';
import ProfileComp from '../../../components/Profile/Profile';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getFriends, getProfileData } from '../../../src/profileSlice';

import { AppDispatch, RootState } from '../../../src/store';
import withAuth from '../../../src/withAuth';
function pages() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { userId } = router.query;
    const { userName, friends } = useSelector((store: RootState) => store.profile)
    const controller = useRef<boolean>(true)
    useEffect(() => {
        async function getData() {
            if (!router.isReady) return

            if (userName === undefined && controller.current)
                dispatch(getProfileData(userId!))
        }
        getData()

        return () => {
            if (router.isReady)
                controller.current = false;
        }
    }, [router.isReady])


    useEffect(() => {
        if (!router.isReady) return
        function setFriends() {
            if (friends.length < 1 && controller.current)
                dispatch(getFriends(String(userId)))
        }
        setFriends()

        return () => {
            if (router.isReady)
                controller.current = false;
        }

    }, [router.isReady])

    return <ProfileComp ></ProfileComp>


}
export default withAuth(pages)