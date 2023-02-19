import React from "react";
import { useMemo ,useEffect,useState,useRef} from "react";
import { createContext } from "react";
import { useContext } from "react";
const PeerContext = createContext();

export default function PeerProvider({ children }) {
  const [peerStream, setPeerStream] = useState(null);
  const senders=useRef([]);
  
  const peer=useMemo(()=>new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    })
  ,[])    
  

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer=await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  }
  const setRemoteAnswer = async ( answer) => {
    await peer.setRemoteDescription(answer);
  }

  const sendStream = async (stream) => {
    console.log(stream)
    const tracks=stream.getTracks()

    for(const track of tracks) {
      try { 
        senders.current.push(peer.addTrack(track,stream));
      } catch (error) {
        console.log(error);
      }
  }
}


useEffect(() => {
  const handler=(event)=>{
    const streams=event.streams
    console.log(streams[0]);
    setPeerStream(streams[0]);

  }

  peer && peer.addEventListener('track',handler)

  return () => {
  peer && peer.removeEventListener('track',handler)
  }
}, [peer]);

  return (
    <PeerContext.Provider value={{ peer, createOffer,createAnswer,setRemoteAnswer,sendStream,peerStream,senders}}>
      {children}
    </PeerContext.Provider>
  );
}
export const usePeer = () => useContext(PeerContext);
