// OneSignalComponent.jsx
import React, { useEffect } from "react";
import OneSignal from "react-onesignal";

const OneSignalComponent = () => {
  useEffect(() => {
    const initOneSignal = async () => {
      await OneSignal.init({
        appId: "06907524-9d59-48d3-aaac-078e174f07bd", // ✅ Your App ID
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });

      // Wait for OneSignal to be fully ready, then call global functions
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(function () {
        window.OneSignal.showSlidedownPrompt(); // ✅ Works here
      });
    };

    initOneSignal();

    // Fake push notification every 30 sec
    const intervalId = setInterval(() => {
      if (window.OneSignal?.sendSelfNotification) {
        window.OneSignal.sendSelfNotification(
          "🔔 New Notification",
          "This is a test sent every 30s",
          "https://a2-d-mizna-test.vercel.app",
          "https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
        );
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>🔔 OneSignal Notification Demo</h2>
      <p>New test notifications will show every 30 seconds if permission is granted.</p>
    </div>
  );
};

export default OneSignalComponent;
