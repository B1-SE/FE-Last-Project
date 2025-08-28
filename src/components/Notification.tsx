import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../redux/store";
import { clearNotification } from "../redux/NotificationSlice";

const Notification = () => {
    const notification = useAppSelector((state) => state.notification.notification);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, 3000); // Disappears after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    if (!notification) return null;

    const backgroundColor = notification.type === 'success' ? '#2ecc71' : '#e74c3c'; // Green for add, red for remove

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor,
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: 1001,
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
            {notification.message}
        </div>
    );
};

export default Notification;