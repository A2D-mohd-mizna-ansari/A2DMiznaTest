import React, { useEffect } from "react";
import OneSignal from "react-onesignal";

const OneSignalComponent = () => {
  useEffect(() => {
    const init = async () => {
      await OneSignal.init({
        appId: "06907524-9d59-48d3-aaac-078e174f07bd", // ✅ Your actual App ID
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: true, // ✅ Needed for http://localhost
      });

      const isPushEnabled = await OneSignal.isPushNotificationsEnabled();
      if (!isPushEnabled) {
        OneSignal.showSlidedownPrompt();
      }
    };

    init();

    // ⏱️ Simulate push every 30 seconds (browser notification)
    const intervalId = setInterval(() => {
      if (Notification.permission === "granted") {
        new Notification("🔔 New Message", {
          body: "This is a simulated notification sent every 30 seconds.",
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
        });
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>🔔 OneSignal Push Notification Demo</h2>
      <p>
        If you've granted permission, a new simulated notification will appear every 30 seconds.
      </p>
    </div>
  );
};

export default OneSignalComponent;
