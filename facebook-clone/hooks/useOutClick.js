'use client'
import { useEffect, useRef,useState } from "react";
import { animationEnder } from "../components/Navbar";


export const useOutClick=()=>{
    
    const ref=useRef(null); 
 const [isActive,setIsActive]=useState(false);
    
    const handler=(e)=>{
        if(isActive && ref.current && !ref.current.contains(e.target) && !e.target.classList.contains('nav-bar-input')){
        animationEnder(isActive);
        setIsActive(false);
    
    }
}
    
    useEffect(()=>{
        document.addEventListener('click',handler,true);

        return ()=>{
            document.removeEventListener('click',handler,true)
        }
    })
return {isActive,setIsActive,ref}
}

