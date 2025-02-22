// const socketIO = require('socket.io');
// const http = require('http');

const ChatRooms = require('../utils/chatHelper');

const chatRooms = new ChatRooms(); // in-memory representation of active chats

module.exports = (io) => {
  const chat = io.of('/chat');

  chat.on('connection', (socket) => {
    socket.on('authenticate', (data) => {
      if (!data || !data.username) { // very strong authentication
        socket.disconnect('unauthorized');
        return;
      }
      chatRooms.addUser(data.username, socket);
      socket.emit('authenticationSuccess', { username: data.username });
    });

    // data: {message: 'hello', users: ['user1', 'user2'], username: 'user1'}
    socket.on('message', (data) => {
      const date = Date.now();
      const room = data.room.split('#').sort().join('#');
      const from = chatRooms.getUser(socket); // later on parse jwt here
      if (from === undefined) {
        return;
      }
      chatRooms.addMessage(room, from, date, data.message);
      chat.to(room).emit('message', { room, from, date, message: data.message });
    });

    socket.on('messages', (data) => { // data refers (in future implementations) to some params, (e.g before this date etc);
      chatRooms.getMessagesForRoom(data.room).then((results) => {
        socket.emit('messages', results, data.room);
      });
    });

    socket.on('openRoom', (data) => { // username and room
      // const date = Date.now();
      const username = data.username;
      const room = data.room.split('#').sort().join('#');
      chatRooms.openRoom(username, room);
    });
    socket.on('closeRoom', (data) => {
      const username = data.username;
      const room = data.room.split('#').sort().join('#');
      chatRooms.closeRoom(username, room);
    });

    socket.on('rooms', (data) => {
      chatRooms.getRooms(data.username).then((results) => {
        socket.emit('rooms', { rooms: results });
      });
    });

    socket.on('allMessages', (data) => {
      const room = data.room.split('#').sort().join('#');
      chatRooms.getMessagesForRoom(room).then((results) => {
        chat.to(room).emit('messages', { messages: results });
      });
    });

    socket.on('disconnect', () => {
      chatRooms.updateUserLastVisits(socket);
      chatRooms.removeUser(socket);
    });
  });
};
