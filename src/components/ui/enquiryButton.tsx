import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { customerApi, EnquiryData } from "@/services/customerApi";
import { GoogleLoginPopup } from "../GooglePopup";

interface EnquiryButtonProps {
  id: string; // product ID
  setFormVisible?: React.Dispatch<React.SetStateAction<boolean>>;

}

export const EnquiryButton: React.FC<EnquiryButtonProps> = ({ id, setFormVisible }) => {
  const { user } = useUserStore();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [enquiryData, setEnquiryData] = useState<EnquiryData>({
    productId: id,
    message: "I am interested in this product. Please provide more details.",
    date: new Date().toISOString().split("T")[0],
    quantity: 1,
  });

  // Prefill if user is logged in (optional)
  useEffect(() => {
    if (!user) {
      setShowLoginPopup(true);
    }
  }, [user]);

//   const handleEnquiryClick = () => {
//     if (user) {
//       setFormVisible(true);
//     } else {
//       setShowLoginPopup(true);
//     }
//   };

  const handleSubmit = async () => {
    // setFormVisible(false);
    
    setFormVisible(false);
    if(loading) return;
    setLoading(true);
    try {
      await customerApi.submitEnquiry(enquiryData);
    //   alert("Enquiry submitted successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      alert("Failed to submit enquiry. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* <button
        className="px-4 py-2 w-full bg-primary text-white rounded transition-colors cursor-pointer hover:bg-primary-700"
        onClick={handleEnquiryClick}
      >
        Enquiry
      </button> */}

      {/* Modal */}
     
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full m-4 p-6 border-t shadow-lg relative">
            {/* Close */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setFormVisible(false)}
            >
              ✕
            </button>

            <h3 className="font-semibold text-lg mb-2">Product Enquiry</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary focus:outline-none"
                  value={enquiryData.quantity}
                  onChange={(e) =>
                    setEnquiryData((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary focus:outline-none"
                  rows={3}
                  value={enquiryData.message}
                  onChange={(e) =>
                    setEnquiryData((prev) => ({ ...prev, message: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Expected Delivery / Contact Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary focus:outline-none"
                  value={enquiryData.date}
                  onChange={(e) =>
                    setEnquiryData((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>

              <button
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={handleSubmit}
              >
                Submit Enquiry
              </button>
            </div>
          </div>
        </div>
     

      {/* Google Login Popup */}
      {showLoginPopup && (
        <GoogleLoginPopup
          onClose={() => {
            setShowLoginPopup(false);
            if (user) setFormVisible(true); // show modal after login
          }}
        />
      )}
    </>
  );
};
