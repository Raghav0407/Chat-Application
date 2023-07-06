//Requiring all the required modules
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const userRoutes =require("./routes/userRoutes")
const messagesRoute = require("./routes/messagesRoute");
const socket = require('socket.io');
//const path = require('path');


//Making our backend app
const app=express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes)
app.use("/api/messages",messagesRoute)
// app.use(express.static(path.join(__dirname,'./public/build')));

// app.get('*',function(req,res){
//     res.sendFile(path.join(__dirname,'./public/build/index.html'));
// })


const PORT1= process.env.PORT;
//Mongodb Database working
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("DB CONNECTION SUCCESSFUL")
}).catch((err)=>{
    console.log(err.message);
})
app.get("/",(req,res)=>{
    res.send("Hello bro");
})
const server = app.listen(PORT1,()=>{
  
    console.log(`App is listening on port ${PORT1}`);

})


//Firstly we have made a connection to the 
//socket.io for the sockets of different user
const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
})

//We will store all the online users in the map
global.onlineUsers = new Map();
//Whenever a user login to the socket then 
//using  we will store the chatSocket of that user to 
//our socket
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    })

    //Whenever there is a message sent by any user then we will 
//check the socket of sentuser and if the user is online 
//then we will send the data to the sentuser and emit the message
socket.on("send-msg",(data)=>{
    console.log("sendmsg",{data});
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket)
    {
        socket.to(sendUserSocket).emit("msg-recieve",data.msg);
    }
})
})





