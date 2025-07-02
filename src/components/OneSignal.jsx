import { useEffect } from "react";

const OneSignalComponent = () => {
  useEffect(() => {
    // Load OneSignal script
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

        console.log("OneSignal initialized");

        // Send notification every 10 seconds to same device
        setInterval(async () => {
          const isEnabled = await OneSignal.isPushNotificationsEnabled();
          if (isEnabled) {
            await OneSignal.sendSelfNotification(
              "Hello 👋",
              "This is a self push notification from this device!",
              "https://your-website.com", // Click destination
              "https://cdn.onesignal.com/sdks/OneSignalSDK/assets/notification-icon.png", // Optional icon
              {
                notificationType: "local", // custom data
              }
            );
          } else {
            console.log("Push not enabled yet.");
          }
        }, 10000);
      });
    };
  }, []);

  return null; // No UI needed
};

export default OneSignalComponent;
