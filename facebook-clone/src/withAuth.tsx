'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { LoginRoute } from '../Routes'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store'
import { setData } from './authSlice'
export interface Props {
    userName: string,
    userId: number,
    isAuth: boolean,
}


const withAuth = (WrappedComponent: (data: any) => any) => {
    return (props: any) => {
        const dispatch = useDispatch<AppDispatch>()
        const { isAuth } = useSelector((store: RootState) => store.auth)
        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.post(LoginRoute, {}, { withCredentials: true })
                    dispatch(setData(response.data))
                    if (!response.data.isAuth) {
                        Router.push('/login')
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            checkAuth()
        }, [])
        return (isAuth) ? <WrappedComponent {...props} /> : null
    }
}

export default withAuth

