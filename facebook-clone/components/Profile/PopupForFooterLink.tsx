'use client'
import React, { useState } from 'react';
import Container from 'reactjs-popup';
import style from '../../styles/profile.module.css'

const Popup = (props: any) => {
    const stylesOfPopupModal = {
        height: "max-content",
        width: 'max-content',
        backgroundColor: "gray",
        padding: '.5em',
    }

    return <Container
        contentStyle={stylesOfPopupModal}
        closeOnDocumentClick on={"focus"} overlayStyle={{ position: "absolute", top: '50%', left: '70%', translate: '-10% -40%' }}
        open={props.open} onClose={() => { props.setState(false) }}>

        <a className={style.moreListItems} href="https://about.facebook.com/">About</a>
        <a className={style.moreListItems} href="https://www.metacareers.com/">Career</a>
        <a className={style.moreListItems} href="https://developers.facebook.com/?ref=pf">Developers</a>
        <a className={style.moreListItems} href="https://www.facebook.com/help/?ref=pf">Help</a>

    </Container>
}
export default function Footer(props: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return <>
        {isModalOpen && <span onClick={() => { setIsModalOpen(false) }} className='more-info'>More</span>}
        {!isModalOpen && <span onClick={() => { setIsModalOpen(true) }} className='more-info'>More</span>}
        <Popup open={isModalOpen} setState={setIsModalOpen}></Popup>
    </>


}
