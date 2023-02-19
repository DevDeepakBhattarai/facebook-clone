import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { FriendsRoute, ProfileRoute } from '../../../Routes';
import Header from '../../../components/Profile/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../src/store';
import { getProfileData, getFriends } from '../../../src/profileSlice';
import withAuth from '../../../src/withAuth';

function friend() {
  const router = useRouter()
  const { userId } = router.query
  const { userName, profilePicture, noOfFriends, isFriendsLoading, friends } = useSelector((store: RootState) => store.profile)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    async function getData() {

      if (!router.isReady) return

      if (userName === undefined) {
        dispatch(getProfileData(userId!))
      }
      if (friends.length < 1)
        dispatch(getFriends(String(userId)))
    }
    getData()

  }, [userId])





  return <>
    <Header></Header>

    <div className='w-[65rem] mx-auto my-4 grid grid-cols-2 gap-4'>
      {isFriendsLoading &&
        getLoadingTemplate().map(template => template)
      }

      {
        (!isFriendsLoading && friends.length < 0) &&
        <div className='my-4 mx-auto p-4 text-2xl font-bold '>No friends to show</div>
      }

      {
        (!isFriendsLoading && friends.length > 0) &&
        friends.map(friend => {
          return <div key={friend.user_id} className='bg-white flex gap-4 rounded-lg p-4'>
            <div className='bg-gray-500 rounded-lg h-28 aspect-square overflow-hidden'>
              <img src={friend.profile_pic} className="h-auto w-auto " alt="" />
            </div>
            <div >
              <span className='font-bold text-lg '>

                {`${friend.first_name} ${friend.last_name}`} <br />
              </span>
              <span className='text-gray-800 text-sm'>
                {friend.noOfMutualFriends !== 0 ? `${friend.noOfMutualFriends} mutual friends` : null}
              </span>
            </div>
          </div>
        })

      }

    </div>
  </>

  function getLoadingTemplate() {
    let loadingTemplate = [];
    if (noOfFriends) {
      for (let i = 0; i < noOfFriends; i++) {
        loadingTemplate.push(
          <div key={i} className='bg-white flex gap-4 rounded-lg p-4'>
            <div className='bg-gray-500 rounded-lg h-28 aspect-square animate-pulse'></div>
            <div className="bg-gray-500 mt-4 h-8 w-28 rounded-lg animate-pulse"></div>
          </div>
        )
      }
    }
    return loadingTemplate;
  }

}
export default withAuth(friend)