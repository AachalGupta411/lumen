import { io } from 'socket.io-client';
import { getSessionId, getToken } from './session.js';

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;
  socket = io({
    path: '/socket.io',
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: {
      token: getToken(),
      sessionId: getSessionId(),
    },
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
