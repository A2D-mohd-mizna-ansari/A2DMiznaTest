import { useEffect, useState, useRef } from "react";

const NotificationComponent = () => {
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const notifyIntervalRef = useRef(null);
  const timerRef = useRef(null);

  const startNotifications = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      const welcomeNotification = new Notification("Welcome!", {
        body: "You just opened the app!",
        icon: "https://a2deats.com/wp-content/uploads/2024/04/Frame-2.png.webp",
      });
      console.log("✅ Welcome notification sent");

      notifyIntervalRef.current = setInterval(() => {
        const notification = new Notification("Auto Notification", {
          body: "This is sent every 10 seconds.",
          icon: "https://a2deats.com/wp-content/uploads/2024/04/Frame-2.png.webp",
        });
        console.log("🔔 Auto notification sent at", new Date().toLocaleTimeString());
      }, 10000);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      setStarted(true);
    } else {
      alert("Notifications are blocked!");
      console.warn("⚠️ Notifications permission was not granted");
    }
  };

  useEffect(() => {
    return () => {
      if (notifyIntervalRef.current) {
        clearInterval(notifyIntervalRef.current);
        console.log("🛑 Cleared auto notification interval");
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        console.log("🛑 Cleared timer interval");
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🔔 Browser Notification Timer</h2>
      <p>App running for: <strong>{seconds}</strong> seconds</p>
      <p>Browser notifications sent every 10 seconds.</p>
      {!started && (
        <button onClick={startNotifications}>Start Notifications</button>
      )}
    </div>
  );
};

export default NotificationComponent;
