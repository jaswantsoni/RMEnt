import React, { useState } from "react";
import { GoogleLoginPopup } from "./GoogleLoginPopup";

interface ProductEnquiryModalProps {
  productId: string;
  onClose: () => void;
}

export const ProductEnquiryModal: React.FC<ProductEnquiryModalProps> = ({ productId, onClose }) => {
 

  return (
    <>
      {/* Modal overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full m-4 p-6 border-t shadow-lg relative">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>

          <h3 className="font-semibold text-lg mb-2">Product Enquiry</h3>
          <p className="text-sm mb-4">
            Please fill in the details below to request more information about this product.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Your Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full p-2 border rounded focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Your Message"
                rows={3}
              />
            </div>

            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              onClick={() => {
                // Open Google login popup if needed
                setShowLoginPopup(true);
                onClose(); // close form
              }}
            >
              Submit Enquiry
            </button>
          </div>
        </div>
      </div>

      {showLoginPopup && <GoogleLoginPopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
};
