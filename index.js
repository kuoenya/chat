const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
 
// 加入線上人數計數
let onlineCount = 0;
 
// 修改 connection 事件
io.on('connection', (socket) => {
    // 加入這段
    //socket.on("send", (msg) => {
      //  console.log(msg)
    //});

    socket.on("send", (msg) => {
    // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
    // 因此我們直接 return ，終止函式執行。
    if (Object.keys(msg).length < 2) return;
        // 廣播訊息到聊天室
        io.emit("msg", msg);
    });
    // 有連線發生時增加人數
    onlineCount++;
    // 發送人數給網頁
    io.emit("online", onlineCount);
 
    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });
 
    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});

// 當發生連線事件
io.on('connection', (socket) => {

    // 加入這段
    //socket.on("send", (msg) => {
      //  console.log(msg)
    //});
    // 修改 console.log 成 io.emit
    socket.on("send", (msg) => {
    // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
    // 因此我們直接 return ，終止函式執行。
    if (Object.keys(msg).length < 2) return;
        // 廣播訊息到聊天室
        io.emit("msg", msg);
    });
    console.log('Hello!');  // 顯示 Hello!

    // 加入這一段
    // 接收來自前端的 greet 事件
    // 然後回送 greet 事件，並附帶內容
    socket.on("greet", () => {
        socket.emit("greet", "Hi! Beauty girl :D "); });
    // 當發生離線事件
    socket.on('disconnect', () => {
        console.log('Bye~');  // 顯示 bye~
    });
});

server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});

