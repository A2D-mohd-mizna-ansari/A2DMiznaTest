// OneSignalComponent.jsx
import { useEffect, useState } from "react";

const OneSignalComponent = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Load OneSignal script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    document.head.appendChild(script);

    // Initialize OneSignal
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: "06907524-9d59-48d3-aaac-078e174f07bd",
      });

      // Send notification on first load
      await OneSignal.Notifications.sendSelfNotification(
        "Welcome!",
        "You just opened the app!",
        "https://yoursite.com",
        "https://yoursite.com/icon.png"
      );

      // Send notification every 10 seconds
      setInterval(() => {
        OneSignal.Notifications.sendSelfNotification(
          "Auto Notification",
          "This is sent every 10 seconds.",
          "https://yoursite.com",
          "https://yoursite.com/icon.png"
        );
      }, 10000);
    });

    // Timer count
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🔔 OneSignal Timer</h2>
      <p>App running for: <strong>{seconds}</strong> seconds</p>
      <p>Notifications sent every 10 seconds using OneSignal</p>
    </div>
  );
};

export default OneSignalComponent;
