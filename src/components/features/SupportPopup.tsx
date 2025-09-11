import { useRef, useEffect } from "react";
import { Phone, Mail, X } from "lucide-react";

export default function SupportPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Trap focus for accessibility
  useEffect(() => {
    if (open && popupRef.current) {
      popupRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" aria-modal="true" role="dialog">
      <div
        ref={popupRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-xl p-6 w-[90vw] max-w-sm border-4 border-teal-800 focus:outline-none relative"
        style={{ fontFamily: 'Nunito Sans, Arial, sans-serif' }}
      >
        <button
          onClick={onClose}
          aria-label="Close support popup"
          className="absolute top-4 right-4 text-teal-800 bg-aqua-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="mb-2">
            <span className="text-teal-800 text-lg font-semibold" style={{ fontFamily: 'Poppins, Arial, sans-serif' }}>Support</span>
          </div>
          <div className="flex items-center gap-2 w-full">
            <Phone className="text-coral-500" size={24} strokeWidth={2.2} />
            <span className="text-gray-800 text-base">+1-720-927-9265</span>
          </div>
          <div className="flex items-center gap-2 w-full">
            <Mail className="text-coral-500" size={24} strokeWidth={2.2} />
            <span className="text-gray-800 text-base">support@memoclarity.com</span>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            We are here to help! Contact us for any questions or support needs.
          </div>
        </div>
      </div>
    </div>
  );
}
