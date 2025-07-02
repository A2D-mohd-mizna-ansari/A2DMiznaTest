import React, { useEffect } from "react";

const OneSignalComponent = () => {
  useEffect(() => {
    // Init SDK
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId: "06907524-9d59-48d3-aaac-078e174f07bd",
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: true,
      });

      // Safe to use OneSignal methods here
      window.OneSignal.isPushNotificationsEnabled().then((enabled) => {
        console.log("Push Notifications Enabled?", enabled);
        if (!enabled) {
          window.OneSignal.showSlidedownPrompt();
        }
      });
    });

    // Simulate push notification every 30 sec
    const intervalId = setInterval(() => {
      window.OneSignal.push(() => {
        if (window.OneSignal.sendSelfNotification) {
          window.OneSignal.sendSelfNotification(
            "🔔 New Notification",
            "Triggered every 30 seconds.",
            "https://a2-d-mizna-test.vercel.app",
            "https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
          );
        }
      });
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>✅ OneSignal Notifications</h2>
      <p>Wait for permission prompt and then you'll receive notifications every 30s.</p>
    </div>
  );
};

export default OneSignalComponent;
