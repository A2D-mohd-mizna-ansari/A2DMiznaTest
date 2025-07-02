// OneSignal.jsx
import React, { useEffect } from "react";
import OneSignal from "react-onesignal";

const OneSignalComponent = () => {
  useEffect(() => {
    const initOneSignal = async () => {
      await OneSignal.init({
        appId: "Y06907524-9d59-48d3-aaac-078e174f07bd", // Replace with your real OneSignal App ID
        safari_web_id: "YOUR_SAFARI_WEB_ID", // Optional, if supporting Safari
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true, // Needed for local development
      });

      OneSignal.showSlidedownPrompt();
    };

    initOneSignal();

    // Fake notification trigger every 30 seconds
    const intervalId = setInterval(() => {
      OneSignal.sendSelfNotification(
        "🚀 New Notification!",
        "This is a test message triggered every 30 seconds.",
        "https://yourwebsite.com", // URL to open on click
        "https://cdn-icons-png.flaticon.com/512/1827/1827504.png" // Optional icon
      );
    }, 30000);

    return () => clearInterval(intervalId); // cleanup
  }, []);

  return (
    <div>
      <h2>🔔 Push Notifications Demo</h2>
      <p>You will get a notification every 30 seconds if permissions are granted.</p>
    </div>
  );
};

export default OneSignalComponent;
