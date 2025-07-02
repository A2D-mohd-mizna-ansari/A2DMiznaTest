import { useEffect, useState } from "react";

const NotificationComponent = () => {
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const startNotifications = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      new Notification("Welcome!", {
        body: "You just opened the app!",
        icon: "https://yoursite.com/icon.png",
      });

      const notifyInterval = setInterval(() => {
        new Notification("Auto Notification", {
          body: "This is sent every 10 seconds.",
          icon: "https://yoursite.com/icon.png",
        });
      }, 10000);

      const timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      // Clear intervals when component unmounts
      return () => {
        clearInterval(timer);
        clearInterval(notifyInterval);
      };
    } else {
      alert("Notifications are blocked!");
    }
  };

  useEffect(() => {
    // startNotifications moved to button click
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🔔 Browser Notification Timer</h2>
      <p>App running for: <strong>{seconds}</strong> seconds</p>
      <p>Browser notifications sent every 10 seconds.</p>
      {!started && (
        <button
          onClick={() => {
            startNotifications();
            setStarted(true);
          }}
        >
          Start Notifications
        </button>
      )}
    </div>
  );
};

export default NotificationComponent;
