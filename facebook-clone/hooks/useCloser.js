'use client'
import { useEffect, useRef,useState } from "react";


export const useCloser=(func,secondFunc)=>{
    
    const ref=useRef();
 const [isActive,setIsActive]=useState(false);
    
    const handler=(e)=>{
        if(isActive && ref.current && !ref.current.contains(e.target))
        {
            func(ref,setIsActive); 
        }
        
    }
    
    useEffect(()=>{
        document.addEventListener('click',handler,true);

        return ()=>{
            document.removeEventListener('click',handler,true)
        }
    })
return [isActive, setIsActive ,ref]
}

