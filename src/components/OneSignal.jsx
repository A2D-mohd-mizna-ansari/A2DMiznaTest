import { useEffect, useState } from "react";

const NotificationComponent = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Request permission for browser notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Show welcome notification
    if (Notification.permission === "granted") {
      new Notification("Welcome!", {
        body: "You just opened the app!",
        icon: "https://yoursite.com/icon.png",
      });
    }

    // Timer for every 10 seconds notification
    const notifyInterval = setInterval(() => {
      if (Notification.permission === "granted") {
        new Notification("Auto Notification", {
          body: "This is sent every 10 seconds.",
          icon: "https://yoursite.com/icon.png",
        });
      }
    }, 10000);

    // Count seconds
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(notifyInterval);
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🔔 Browser Notification Timer</h2>
      <p>App running for: <strong>{seconds}</strong> seconds</p>
      <p>Browser notifications sent every 10 seconds.</p>
    </div>
  );
};

export default NotificationComponent;
