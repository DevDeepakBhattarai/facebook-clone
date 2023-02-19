import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
import withAuth from '../src/withAuth';
import { useSelector } from 'react-redux'
const OTPInput = dynamic(() => import('../components/OTPInput'), { ssr: false })
function Verify() {
  const data = useSelector(store => store)
  console.log(data);


  const router = useRouter()

  return (
    <OTPInput email={router.query.email} optLength={router.query.otpLength} />
  )
}
export default withAuth(Verify)