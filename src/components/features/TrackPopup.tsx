import { useState, useRef, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import fedexImg from "../../lib/TrackImages/FedEx.png";
import uspsImg from "../../lib/TrackImages/UpsTracking.png";

const TABS = [
  {
    name: "FedEx",
    link: "https://www.fedex.com/en-us/tracking.html",
    img: fedexImg,
    instructions: [
      "Click the link below to open FedEx tracking.",
      "Type or paste your tracking number in the field.",
      "See the image for reference.",
      "Click 'Track' to view your shipment status."
    ]
  },
  {
    name: "USPS",
    link: "https://tools.usps.com/go/TrackActiona",
    img: uspsImg,
    instructions: [
      "Click the link below to open USPS tracking.",
      "Type or paste your tracking number in the field.",
      "See the image for reference.",
      "Click 'Track' to view your shipment status."
    ]
  }
];

export default function TrackPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && popupRef.current) {
      popupRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const tab = TABS[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" aria-modal="true" role="dialog">
      <div
        ref={popupRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-xl p-6 w-[95vw] max-w-md border-4 border-teal-800 focus:outline-none relative"
        style={{ fontFamily: 'Nunito Sans, Arial, sans-serif' }}
      >
        <button
          onClick={onClose}
          aria-label="Close track popup"
          className="absolute top-4 right-4 text-teal-800 bg-aqua-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <div className="flex gap-2 mb-4 justify-center">
          {TABS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full font-semibold text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 ${activeTab === i ? 'bg-teal-800 text-white' : 'bg-aqua-200 text-teal-800'}`}
              style={{ fontFamily: 'Poppins, Arial, sans-serif' }}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 items-center">
          <a
            href={tab.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-amber-500 font-semibold underline text-base mb-2 hover:text-amber-600"
          >
            Go to {tab.name} Tracking <ExternalLink size={18} />
          </a>
          <ol className="list-decimal pl-5 text-gray-800 text-base w-full mb-2">
            {tab.instructions.map((step, idx) => (
              <li key={idx} className="mb-1">{step}</li>
            ))}
          </ol>
          <div className="w-full flex justify-center">
            <img
              src={tab.img}
              alt={`${tab.name} tracking screenshot`}
              className="rounded-lg border border-teal-100 shadow-md max-h-56 object-contain bg-white"
              style={{ background: '#F8F9FA' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
