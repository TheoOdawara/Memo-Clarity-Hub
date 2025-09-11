import { useState, useRef, useEffect } from "react";
import { X, BookOpen, Gift, Download } from "lucide-react";

const INSTRUCTION_PDF = {
  name: "Instructions",
  file: "/src/lib/pdfs/Memo-Clarity-Daily-Capsule-Manual (1).pdf",
  title: "How to Take MemoClarity Daily Capsule",
  description: "Step-by-step guide for safe and effective use."
};

const BONUS_PDFS = [
  {
    name: "101 Herbal Cures",
    file: "/src/lib/pdfs/101-Herbal-Cures-Natural-Remedies-for-Everyday-Wellness.pdf",
    description: "Natural remedies for everyday wellness."
  },
  {
    name: "Daily Mental Exercises",
    file: "/src/lib/pdfs/Daily-Mental-Exercises-to-Accelerate-Memory-Recovery.pdf",
    description: "Mental exercises to boost memory recovery."
  },
  {
    name: "Super Gut Code",
    file: "/src/lib/pdfs/Super-Gut-Code.pdf",
    description: "Gut health strategies for cognitive support."
  }
];

export default function InstructionsBonusesPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && popupRef.current) {
      popupRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div
        ref={popupRef}
        tabIndex={-1}
        className="bg-gradient-to-br from-teal-50 via-aqua-200 to-white rounded-3xl shadow-2xl p-8 w-[98vw] max-w-xl border-4 border-teal-800 focus:outline-none relative animate-fadein"
        style={{ fontFamily: 'Nunito Sans, Arial, sans-serif' }}
      >
              <button
                onClick={onClose}
                aria-label="Close instructions popup"
                className="absolute top-1 right-2 text-teal-800 bg-aqua-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
        <div className="flex gap-3 mb-6 justify-center">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 ${activeTab === 0 ? 'bg-teal-800 text-white shadow-md' : 'bg-aqua-200 text-teal-800'}`}
            style={{ fontFamily: 'Poppins, Arial, sans-serif' }}
          >
            <BookOpen size={22} /> Instructions
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 ${activeTab === 1 ? 'bg-amber-400 text-teal-900 shadow-md' : 'bg-aqua-200 text-teal-800'}`}
            style={{ fontFamily: 'Poppins, Arial, sans-serif' }}
          >
            <Gift size={22} /> Bonuses
          </button>
        </div>
        <div className="transition-all duration-300">
          {activeTab === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-2xl font-bold text-teal-800 mb-2" style={{ fontFamily: 'Poppins, Arial, sans-serif' }}>{INSTRUCTION_PDF.title}</div>
              <div className="text-base text-gray-700 mb-2 text-center max-w-md">{INSTRUCTION_PDF.description}</div>
              <a
                href={INSTRUCTION_PDF.file}
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-teal-900 font-bold text-lg shadow-lg hover:bg-amber-500 transition-all focus:outline-none focus:ring-2 focus:ring-teal-800"
              >
                <Download size={24} /> Download PDF
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              {BONUS_PDFS.map((pdf, idx) => (
                <div key={idx} className="w-full bg-white/80 rounded-2xl border border-teal-100 shadow p-4 flex flex-col items-center gap-2">
                  <div className="text-lg font-semibold text-teal-800" style={{ fontFamily: 'Poppins, Arial, sans-serif' }}>{pdf.name}</div>
                  <div className="text-sm text-gray-600 text-center mb-2">{pdf.description}</div>
                  <a
                    href={pdf.file}
                    download
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 text-teal-900 font-bold text-base shadow hover:bg-amber-500 transition-all focus:outline-none focus:ring-2 focus:ring-teal-800"
                  >
                    <Download size={20} /> Download PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
