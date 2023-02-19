"use client"
import React, { useState } from 'react';
import Container from 'reactjs-popup'
import style from '../../styles/profile.module.css'

function Options(props: any) {

    const stylesOfPopupModal = {
        height: "max-content",
        width: 'max-content',
        backgroundColor: "gray",
        padding: '.5em',
    }
    return <Container closeOnDocumentClick on={"focus"} overlayStyle={{ position: "absolute", top: '50%', left: '70%', translate: '-10% -40%' }}
        open={props.open} contentStyle={stylesOfPopupModal} onClose={() => { props.setState(false) }}>
        <li className={style.hamburgerMenuItems}>
            <img src="/eye.png" alt="" />
            View As
        </li>

        <li className={style.hamburgerMenuItems}>
            <img src="/search.png" alt="" />            Search
            Search
        </li>
        <li className={style.hamburgerMenuItems}>
            <img src="/danger.png" alt="" />
            Account Status
        </li>

        <li className={style.hamburgerMenuItems}>
            <img src="/archive.png" alt="" />
            Archive</li>
        <li className={style.hamburgerMenuItems}>
            <img src="/story.png" alt="" />
            Story Archive</li>

        <li className={style.hamburgerMenuItems}>
            <img src="/activity.png" alt="" />
            Activity log</li>

        <li className={style.hamburgerMenuItems}>
            <img src="/setting.png" alt="" />
            Profile and tagging setting </li>

        <li className={style.hamburgerMenuItems}>
            <img src="/bag.png" alt="" />
            Turn on professional mode</li>

    </Container >
}
export default function PopupForHamburger() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            {isModalOpen &&
                <div onClick={() => {
                    setIsModalOpen(false);
                }} className={style.hamburger}>
                    <i className="fas fa-ellipsis-h"></i>
                </div>}

            {!isModalOpen &&
                <div
                    onClick={() => {
                        setIsModalOpen(true);
                    }} className={style.hamburger}>
                    <i className="fas fa-ellipsis-h"></i>
                </div>}

            <Options open={isModalOpen} setState={setIsModalOpen} />
        </>
    );
}
