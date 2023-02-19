"use client"
import React from 'react'
import style from '../../styles/profile.module.css'
import { useState } from 'react'
import Container from 'reactjs-popup'
type PropsOFMoreOptions = {
    open: boolean,
    setState: any
}

const MoreOptions = (props: PropsOFMoreOptions) => {

    const stylesOfPopupModal = {
        height: "max-content",
        width: 'max-content',
        backgroundColor: "gray",
        padding: '.5em',
    }
    return <Container keepTooltipInside on={"focus"}

        overlayStyle={{ position: "absolute", top: '50%', left: '50%', translate: "-35% -55%" }} onClose={() => {
            props.setState(false)
        }} contentStyle={stylesOfPopupModal} closeOnDocumentClick
        open={props.open}>
        <li className={style.moreListItems}>Sports</li>
        <li className={style.moreListItems}>Music</li>
        <li className={style.moreListItems}>Films</li>
        <li className={style.moreListItems}>TV programs</li>
        <li className={style.moreListItems}>Books</li>
        <li className={style.moreListItems}>Likes</li>
        <li className={style.moreListItems}>Events</li>
        <li className={style.moreListItems}>Questions</li>
        <li className={style.moreListItems}>Review given</li>
        <li className={style.moreListItems}>Groups</li>
        <li className={style.moreListItems}>Manage Section</li>
    </Container>
}
export default function Popup() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <>
            {isPopupOpen &&
                <li onClick={() => {
                    setIsPopupOpen(false)
                }} className={style.notActiveButton} style={{ display: 'flex', alignItems: 'center', gap: ".2em" }}>More
                    <i className="fa-solid fa-caret-down"></i>
                </li>
            }
            {!isPopupOpen &&
                <li onClick={() => {
                    setIsPopupOpen(true)
                }} className={style.notActiveButton} style={{ display: 'flex', alignItems: 'center', gap: ".2em" }}>More
                    <i className="fa-solid fa-caret-down"></i>
                </li>
            }
            <MoreOptions open={isPopupOpen} setState={setIsPopupOpen}></MoreOptions>
        </>
    )
}
