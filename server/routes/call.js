const express=require("express");
const router=express.Router();
const {v4:uuid}=require('uuid');
const mysql = require("mysql2");
const db = mysql.createConnection({
    user: "Deepak",
    host: process.env.HOST,
    database: "facebook",
    password: "Deepak",
  });

module.exports = {callRouter:router,callStart:function(io){
io.on('connection',function(socket){
    
    // socket.on('socketMap',data=>{
    //     db.query('select * from user_id_to_socketid where user_id=?',[data.userId],(err,result)=>{
    //         if(err){
    //             console.log(err)
    //         }
    //         if(!result.length>0){
    //             let sql="insert into user_id_to_socketid values(?,?))";
    //             db.query(sql,[data.userId,socket.id])
    //         }
    //         else{
    //          let sql="update user_id_to_socketid set socket_id=? where user_id=?";
    //          db.query(sql,[socket.id,data.userId])   
    //         }
            
    //     })

      
    // })

    socket.on('joinCallRoom',(data)=>{
        socket.join(data.roomName)
    })

    socket.on('callUser',data=>{
        socket.to(data.userToCall).emit('beingCalled',{offer:data.offer,roomName:data.roomName,negotiationneeded:data.negotiationneeded})
    })

      socket.on('callAccepted',data=>{
        socket.to(data.roomName).emit('callAccepted',{answer:data.answer})
    })
    
    socket.on('acceptCall',(data)=>{
        socket.to(data.to).emit('callAccepted',data.signal)
    })

    socket.on('negotiationNeeded',data=>{
        socket.to(data.roomName).emit('negotiationNeeded',{offer:data.offer,roomName:data.roomName})
    })

    socket.on('iceCandidate',(data)=>{
        socket.to(data.roomName).emit("iceCandidate",{candidate:data.candidate})
    })


    socket.on('callEnded',data=>{
        console.log(data.roomName)
        socket.to(data.roomName).emit("callEnded",{})
    })
 
    
})
}}