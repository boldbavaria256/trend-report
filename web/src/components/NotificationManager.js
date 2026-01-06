'use client';
import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function NotificationManager() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [registration, setRegistration] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && VAPID_PUBLIC_KEY) {
            // Wait for service worker to be ready
            navigator.serviceWorker.ready.then(reg => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then(sub => {
                    if (sub) {
                        setSubscription(sub);
                        setIsSubscribed(true);
                    }
                });
            });
        }
    }, []);

    const subscribe = async () => {
        if (!registration || !VAPID_PUBLIC_KEY) {
            console.error("Registration or VAPID key missing");
            return;
        }
        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
            setSubscription(sub);
            setIsSubscribed(true);

            // Send to backend
            const res = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sub),
            });

            if (!res.ok) {
                throw new Error('Failed to save subscription to server');
            }

            console.log('User subscribed to push notifications');
        } catch (error) {
            console.error('Failed to subscribe', error);
            alert('Failed to enable notifications. Please check your permissions.');
        }
    };

    const unsubscribe = async () => {
        if (!subscription) return;
        try {
            await subscription.unsubscribe();
            setIsSubscribed(false);
            setSubscription(null);
            console.log('User unsubscribed');
        } catch (error) {
            console.error('Error unsubscribing', error);
        }
    };

    if (!VAPID_PUBLIC_KEY) return null;

    return (
        <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            aria-label={isSubscribed ? "Disable Notifications" : "Enable Notifications"}
            title={isSubscribed ? "Disable Notifications" : "Enable Notifications"}
        >
            {isSubscribed ? <Bell className="w-5 h-5 fill-current" /> : <BellOff className="w-5 h-5 text-zinc-500" />}
            {isSubscribed && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-black"></span>
            )}
        </button>
    );
}
