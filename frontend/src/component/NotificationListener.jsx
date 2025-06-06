// NotificationListener.jsx
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL, {
  transports: ['websocket'],
  withCredentials: true,
});

const NotificationListener = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Prepare the audio
    audioRef.current = new Audio('/notification.mp3');

    // Unlock the audio playback on first user interaction
    const unlockAudio = () => {
      audioRef.current.play().then(() => {
        audioRef.current.pause(); // immediately pause
        audioRef.current.currentTime = 0; // reset to start
        console.log('Audio unlocked');
      }).catch((err) => {
        console.warn('Unlocking failed:', err);
      });

      // Remove listener after unlocking
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);

    // Socket event handler
    socket.on('newMessage', (message) => {
      console.log('New message:', message);
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn('Playback blocked (again):', err);
        });
      }
    });

    return () => {
      socket.off('newMessage');
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  return null;
};

export default NotificationListener;
