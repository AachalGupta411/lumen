import jwt from 'jsonwebtoken';

export const initSockets = (io) => {
  io.use((socket, next) => {
    const { token, sessionId } = socket.handshake.auth || {};
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
      } catch {
        /* ignore – join as guest */
      }
    }
    if (sessionId) socket.sessionId = sessionId;
    next();
  });

  io.on('connection', (socket) => {
    if (socket.userId) socket.join(`user:${socket.userId}`);
    if (socket.sessionId) socket.join(`guest:${socket.sessionId}`);

    socket.on('cart:join', ({ userId, sessionId }) => {
      if (userId) socket.join(`user:${userId}`);
      if (sessionId) socket.join(`guest:${sessionId}`);
    });

    socket.on('disconnect', () => {});
  });
};
