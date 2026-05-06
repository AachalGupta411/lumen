import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket } from '../services/socket.js';
import { setCart } from '../redux/slices/cartSlice.js';
import { getSessionId } from '../services/session.js';

export const useCartSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit('cart:join', {
      userId: user?.id,
      sessionId: getSessionId(),
    });

    const handler = (cart) => dispatch(setCart(cart));
    socket.on('cart:update', handler);

    return () => {
      socket.off('cart:update', handler);
    };
  }, [user?.id, dispatch]);

  useEffect(() => () => disconnectSocket(), []);
};
