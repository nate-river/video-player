// 处理路径和文件
const path = require('path');
const fs = require('fs');

// 服务器的
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


// 静态资源
app.use(express.static('./public'));

// 1. 页面
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./view/video.html'));
})
io.on('connection', (socket) => {
  fs.watch('./public', () => socket.emit('refresh'))
  // socket.emit('server-push', { hello: 'world' });
  socket.on('message', (data) => {
    socket.emit('server-push', data);
    socket.broadcast.emit('server-push', data);
  });
});
server.listen(3000);
