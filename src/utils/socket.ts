import io from 'socket.io-client';

const socket = io(String(process.env.NEXT_PUBLIC_API_BASE_URL));

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

socket.on('connect_error', (err: Error) => {
  console.error('Socket.IO connection error:', err.message);
});

export default socket;
