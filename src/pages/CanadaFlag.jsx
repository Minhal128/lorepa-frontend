export default function CanadaFlag({ className = "w-4 h-3" }) {
  return (
    <svg viewBox="0 0 60 30" className={className}>
      <rect width="60" height="30" fill="#fff" />
      <rect width="15" height="30" fill="#d52b1e" />
      <rect x="45" width="15" height="30" fill="#d52b1e" />
      <path
        fill="#d52b1e"
        d="M30 4 L32 10 L38 8 L35 14 L40 15 L35 17 L37 23 L31 20 L30 25 L29 20 L23 23 L25 17 L20 15 L25 14 L22 8 L28 10 Z"
      />
    </svg>
  );
}
