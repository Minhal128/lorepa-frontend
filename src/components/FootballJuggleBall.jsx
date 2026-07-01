import { useEffect, useState } from "react";

const FLAGS = [
  { name: "Argentina", stripes: ["#75AADB", "#FFFFFF", "#75AADB"] },
  { name: "Portugal", split: ["#046A38", "#DA291C"] },
  { name: "France", split: ["#0055A4", "#FFFFFF", "#EF4135"] },
  { name: "Brazil", stripes: ["#009C3B", "#FFDF00", "#009C3B"] },
  { name: "Germany", stripes: ["#000000", "#DD0000", "#FFCE00"] },
  { name: "Spain", stripes: ["#AA151B", "#F1BF00", "#AA151B"] },
];

export default function FootballJuggleBall({ size = 26 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FLAGS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const flag = FLAGS[index];
  const colors = flag.split || flag.stripes;
  const vertical = Boolean(flag.split);

  return (
    <div
      className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none animate-ball-juggle"
      style={{ width: size, height: size }}
      title={`${flag.name} ball`}
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <defs>
          <clipPath id="ballClip">
            <circle cx="20" cy="20" r="19" />
          </clipPath>
        </defs>
        <g clipPath="url(#ballClip)">
          {colors.map((c, i) => {
            const step = 40 / colors.length;
            return vertical
              ? <rect key={i} x={i * step} y="0" width={step} height="40" fill={c} />
              : <rect key={i} x="0" y={i * step} width="40" height={step} fill={c} />;
          })}
        </g>
        <circle cx="20" cy="20" r="19" fill="none" stroke="#111" strokeWidth="1.2" opacity="0.5" />
        <circle cx="20" cy="12" r="2.6" fill="none" stroke="#111" strokeWidth="1" opacity="0.4" />
        <circle cx="14" cy="24" r="2.6" fill="none" stroke="#111" strokeWidth="1" opacity="0.4" />
        <circle cx="26" cy="24" r="2.6" fill="none" stroke="#111" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}
