import Stack from "./Stack";
import CanadaFlag from "./CanadaFlag";

export default function Responsive({ images = [], labels = [] }) {
  const cards = images.map((src, idx) => (
    <div key={idx} className="relative w-full h-full">
      <img
        src={src}
        alt={labels[idx] || `card-${idx}`}
        className="w-full h-full object-cover pointer-events-none"
      />
      {labels[idx] && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
          <CanadaFlag className="w-4 h-3 rounded-[1px] shrink-0" />
          {labels[idx]}
        </div>
      )}
    </div>
  ));

  return (
    <div className="flex justify-center py-4">
      <div style={{ width: 220, height: 220 }}>
        <Stack randomRotation sensitivity={150} sendToBackOnClick autoplay autoplayDelay={2500} cards={cards} />
      </div>
    </div>
  );
}
