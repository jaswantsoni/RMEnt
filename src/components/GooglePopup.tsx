import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/userStore";
import { customerApi } from "@/services/customerApi";

interface GoogleLoginPopupProps {
  onClose?: () => void;
  enquiryData?: any;

}

export const GoogleLoginPopup: React.FC<GoogleLoginPopupProps> = ({
  onClose,
  enquiryData
}) => {
  const { login } = useUserStore();
  const { toast } = useToast();
  const submitEnquiryAfterLogin = async (token: string) => {
    if (enquiryData) {
      try {
        const response = await customerApi.submitEnquiry(enquiryData);

        if (!response.ok) throw new Error("Failed to submit enquiry");

        toast({
          title: "Enquiry Submitted",
          description: "Your enquiry has been submitted successfully.",
        });
      } catch (err) {
        toast({
          title: "Enquiry Error",
          description:
            err instanceof Error ? err.message : "Failed to submit enquiry",
          variant: "destructive",
        });
      }
    }
  }

  useEffect(() => {
    // 1️⃣ Frontend popup callback page
    const redirectUrl = `${window.location.origin}/popup-callback`;

    // 2️⃣ Backend OAuth URL
    const oauthUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google?redirect=${encodeURIComponent(
      redirectUrl
    )}`;

    // 3️⃣ Open centered popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      oauthUrl,
      "googleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups for this site",
        variant: "destructive",
      });
      onClose?.();
      return;
    }

    // 4️⃣ Listen for token or error from popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.token) {
        localStorage.setItem("auth_token", event.data.token);
        await submitEnquiryAfterLogin(event.data.token);

        toast({
          title: "Welcome!",
          description: "Successfully signed in with Google",
        });

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${event.data.token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch user data");

          const userData = await response.json();
          const rawUser = userData.data?.user || userData.user || userData.data || userData;

          const user = {
            ...rawUser,
            firstName: rawUser.firstName || rawUser.first_name || rawUser.given_name || "",
            lastName: rawUser.lastName || rawUser.last_name || rawUser.family_name || "",
            avatar_url: rawUser.avatar_url || rawUser.avatar || rawUser.picture,
          };

          login(user, event.data.token);
        } catch (err) {
          toast({
            title: "Authentication Error",
            description:
              err instanceof Error ? err.message : "Failed to complete authentication",
            variant: "destructive",
          });
        }
      } else if (event.data?.error) {
        toast({
          title: "Login Failed",
          description: event.data.error,
          variant: "destructive",
        });
      }

      window.removeEventListener("message", handleMessage);
      onClose?.();
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [login, toast, onClose]);

  return null; // hidden component
};
