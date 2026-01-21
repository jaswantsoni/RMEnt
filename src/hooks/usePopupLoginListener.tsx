import { useEffect } from "react";
import { useUserStore } from "@/store/userStore"; // your Zustand/Redux store

export const usePopupLoginListener = () => {
  const { login } = useUserStore();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.token) {
        const token = event.data.token;
        localStorage.setItem("auth_token", token);

        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const userData = await res.json();
            login(userData.data || userData, token);
          } else {
            console.error("Failed to fetch user data for popup login");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }

      if (event.data?.error) {
        console.error("Popup login error:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [login]);
};
