import { useEffect, useRef, useState } from "react";

const OneSignalComponent = () => {
  const intervalRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState([]);

  useEffect(() => {
    // Load OneSignal script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.init({
          appId: "06907524-9d59-48d3-aaac-078e174f07bd",
          notifyButton: {
            enable: true,
          },
        });

        console.log("✅ OneSignal Initialized");

        const sendNotification = async () => {
          const isEnabled = await OneSignal.isPushNotificationsEnabled();
          if (isEnabled) {
            await OneSignal.sendSelfNotification(
              "🔔 Notification Triggered",
              "This was sent from your own browser!",
              "https://your-site.com",
              "https://cdn.onesignal.com/sdks/OneSignalSDK/assets/notification-icon.png"
            );

            const time = new Date().toLocaleTimeString();
            setLog((prev) => [`[${time}] Notification sent`, ...prev]);
          } else {
            console.log("❌ Push not enabled");
          }
        };

        // Start triggering every 10 seconds
        const startTrigger = () => {
          if (!intervalRef.current) {
            intervalRef.current = setInterval(sendNotification, 10000);
            setIsRunning(true);
          }
        };

        // Automatically start on load
        startTrigger();

        // Cleanup when component unmounts
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
          }
        };
      });
    };
  }, []);

  const stopTrigger = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h3>📢 OneSignal Self Push</h3>
      <button onClick={stopTrigger} disabled={!isRunning} style={{ marginBottom: "1rem" }}>
        🛑 Stop Notifications
      </button>
      <div>
        <strong>Status:</strong> {isRunning ? "Running..." : "Stopped"}
      </div>
      <hr />
      <div>
        <strong>Notification Log:</strong>
        <ul>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OneSignalComponent;
