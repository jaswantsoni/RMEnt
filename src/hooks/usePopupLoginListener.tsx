import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export const usePopupLoginListener = () => {
  const { login } = useUserStore();
  const { processPendingItem, syncGuestCart } = useCartStore();
  const { syncGuestWishlist } = useWishlistStore();

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
            
            // Sync guest cart and wishlist, then process pending item
            await syncGuestCart();
            await syncGuestWishlist();
            await processPendingItem();
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
  }, [login, processPendingItem, syncGuestCart, syncGuestWishlist]);
};
