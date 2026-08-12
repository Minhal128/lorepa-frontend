import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { BoxesIcon, StarIcon, CompassIcon } from "@animateicons/react/lucide";
import Logo from "../assets/logo.svg";
import LogoCropped from "../assets/logo_cropped.svg";
// Unused imports removed since we now use public directory images directly

import { FaStar, FaHeart } from "react-icons/fa";
import {
  FiSearch,
  FiCalendar,
  FiKey,
  FiMapPin,
  FiMenu,
  FiChevronDown,
  FiArrowRight,
  FiSliders,
  FiHome,
  FiTool,
  FiWind,
  FiBox,
} from "react-icons/fi";
import Stack from "../components/Stack";
import CanvasRevealEffect from "../components/CanvasRevealEffect";

/* ─── animated counter ─────────────────────────────────────────────────────── */

function CountUp({ to, decimals = 0, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const ms = duration * 1000;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / ms, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * to;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, to, decimals, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─── static data ────────────────────────────────────────────────────────── */

const steps = [
  {
    step: "1",
    icon: <FiSearch className="w-10 h-10 text-[#2563EB]" />,
    title: "Cherche près de toi",
    desc: "Entre ta ville ou ton code postal pour voir les remorques disponibles",
  },
  {
    step: "2",
    icon: <FiCalendar className="w-10 h-10 text-[#2563EB]" />,
    title: "Choisis et réserve",
    desc: "Sélectionne la remorque qui te convient et confirme en ligne",
  },
  {
    step: "3",
    icon: <FiKey className="w-10 h-10 text-[#2563EB]" />,
    title: "Récupère et roule",
    desc: "Prends la remorque chez le propriétaire et c'est parti !",
  },
];

const useCases = [
  {
    icon: <FiHome className="w-10 h-10" />,
    title: "Déménagement",
    desc: "Idéal pour déménager meubles et boîtes en toute simplicité.",
    colors: [[37, 99, 235], [96, 165, 250]],
  },
  {
    icon: <FiTool className="w-10 h-10" />,
    title: "Rénovation",
    desc: "Transporte tes matériaux, outils et équipements en toute sécurité.",
    colors: [[99, 102, 241], [139, 92, 246]],
  },
  {
    icon: <FiWind className="w-10 h-10" />,
    title: "Motoneige",
    desc: "Remorques parfaites pour transporter ta motoneige en toute saison.",
    colors: [[6, 182, 212], [34, 211, 238]],
  },
  {
    icon: <FiBox className="w-10 h-10" />,
    title: "Transport cargo",
    desc: "Pour tous tes chargements, gros ou petits, courts ou longs trajets.",
    colors: [[14, 165, 233], [59, 130, 246]],
  },
];

/* ─── use case card with canvas reveal on hover ─────────────────────────── */

function UseCaseCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const CORNERS = [
    { top: "10px", left: "10px" },
    { top: "10px", right: "10px" },
    { bottom: "10px", left: "10px" },
    { bottom: "10px", right: "10px" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center justify-center h-72 rounded-[20px] overflow-hidden cursor-default"
      style={{
        border: "1px solid rgba(226,232,240,0.8)",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(37,99,235,0.07), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Corner + decorations */}
      {CORNERS.map((pos, i) => (
        <span
          key={i}
          className="absolute text-xl font-thin pointer-events-none select-none"
          style={{ ...pos, color: "rgba(0,0,0,0.12)" }}
        >
          +
        </span>
      ))}

      {/* Canvas reveal on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <CanvasRevealEffect
              colors={item.colors}
              dotSize={2}
              animationSpeed={3}
              containerClassName="bg-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-7">
        <div className="mb-4" style={{ color: "#2563EB" }}>
          {item.icon}
        </div>
        <h3 className="font-bold text-[18px] mb-2" style={{ color: "#0F172A" }}>
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── listing card data for the Stack ────────────────────────────────────── */

const listings = [
  {
    img: "/img4.webp",
    title: "Remorque cargo 5' x 8'",
    location: "Châteauguay, QC",
    price: 115,
    rating: 4.9,
    reviews: 15,
  },
  {
    img: "/img5.webp",
    title: "Remorque plateau 7' x 16'",
    location: "Drummondville, QC",
    price: 60,
    rating: 4.6,
    reviews: 12,
  },
  {
    img: "/img3.webp",
    title: "Remorque fermée 6' x 12'",
    location: "Saint-Hyacinthe, QC",
    price: 95,
    rating: 4.7,
    reviews: 31,
  },
  {
    img: "/img2.webp",
    title: "Remorque Plateforme 20' PJ (Porte-Auto)",
    location: "Montréal, QC",
    price: 140,
    rating: 4.9,
    reviews: 18,
  },
  {
    img: "/img1.webp",
    title: "Remorque utilitaire 5' x 10'",
    location: "Laval, QC",
    price: 100,
    rating: 4.8,
    reviews: 24,
  },
];

/* ─── glassmorphism + diamond listing card ───────────────────────────────── */

function ListingCard({ listing, index }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{
        /* ── Blue-tinted glass base ── */
        background:
          "linear-gradient(140deg, rgba(239,246,255,0.82) 0%, rgba(219,234,254,0.72) 28%, rgba(255,255,255,0.55) 50%, rgba(191,219,254,0.68) 72%, rgba(239,246,255,0.82) 100%)",
        backdropFilter: "blur(36px)",
        WebkitBackdropFilter: "blur(36px)",
        borderRadius: "24px",
        /* ── Layered blue glow shadow ── */
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.75)",          /* glass rim */
          "0 2px 0 1px rgba(147,197,253,0.35)",         /* blue top highlight */
          "0 20px 60px rgba(37,99,235,0.28)",           /* blue depth glow */
          "0 6px 20px rgba(37,99,235,0.18)",            /* inner blue */
          "0 2px 8px rgba(0,0,0,0.08)",                 /* subtle shadow */
          "inset 0 1px 0 rgba(255,255,255,0.95)",       /* top glass shine */
          "inset 1px 0 0 rgba(255,255,255,0.50)",       /* left glass shine */
          "inset 0 -1px 0 rgba(219,234,254,0.40)",      /* bottom blue tint */
        ].join(", "),
      }}
    >
      {/* ── Diamond facet grid overlay ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          /* Two crossing sets of lines form a diamond lattice */
          backgroundImage: [
            "linear-gradient(60deg, transparent 30%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 31%, transparent 31%)",
            "linear-gradient(-60deg, transparent 30%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 31%, transparent 31%)",
          ].join(", "),
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Blue radial glow — top-right corner ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(96,165,250,0.32) 0%, rgba(147,197,253,0.15) 45%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Blue radial glow — bottom-left corner ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "-25px",
          left: "-25px",
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(59,130,246,0.22) 0%, rgba(147,197,253,0.10) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Animated diamond shimmer sweep ──────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "90px",
          /* diagonal shimmer stripe */
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 45%, rgba(219,234,254,0.30) 55%, transparent 100%)",
          transform: "skewX(-18deg)",
          pointerEvents: "none",
          zIndex: 1,
        }}
        animate={{ left: ["-30%", "130%"] }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3.8,
        }}
      />

      {/* ── Prismatic top-edge highlight ────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "2px",
          borderRadius: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(147,197,253,0.9) 25%, rgba(255,255,255,1) 50%, rgba(147,197,253,0.9) 75%, transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ══ Card content (sits above all effect layers) ══════════════════ */}
      <div
        className="flex flex-col h-full"
        style={{ position: "relative", zIndex: 3 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{
            borderBottom: "1px solid rgba(219,234,254,0.55)",
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center gap-2">
            <img src={LogoCropped} alt="Lorepa" className="h-5 w-auto" />
            <span className="font-bold text-[#0F172A] text-sm tracking-tight">
              Lorepa
            </span>
          </div>
          <FiMenu className="w-4 h-4 text-[#64748B]" />
        </div>

        {/* Search bar */}
        <div className="px-5 pt-3.5 pb-2.5 shrink-0">
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(219,234,254,0.80)",
              boxShadow:
                "0 2px 8px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <FiMapPin className="w-4 h-4 text-[#64748B] shrink-0" />
            <span className="text-sm text-[#1E293B] flex-1 font-medium">
              {listing.location}
            </span>
            <div
              className="rounded-lg p-2 shrink-0"
              style={{
                background: "#2563EB",
                boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
              }}
            >
              <FiSearch className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 px-5 pb-4 shrink-0">
          {["Type", "Date", "Prix"].map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-full text-xs text-[#374151] font-medium"
              style={{
                border: "1px solid rgba(219,234,254,0.90)",
                padding: "5px 12px",
                background: "rgba(255,255,255,0.80)",
              }}
            >
              {f}
              <FiChevronDown className="w-3 h-3" />
            </span>
          ))}
          <span
            className="ml-auto rounded-full p-2"
            style={{
              border: "1px solid rgba(219,234,254,0.90)",
              background: "rgba(255,255,255,0.80)",
            }}
          >
            <FiSliders className="w-3.5 h-3.5 text-[#374151]" />
          </span>
        </div>

        {/* Trailer image */}
        <div
          className="mx-5 rounded-2xl overflow-hidden shrink-0"
          style={{
            height: "200px",
            boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
          }}
        >
          <img
            src={listing.img}
            alt={listing.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Listing details */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 flex-1">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#0F172A] text-sm leading-snug truncate pr-2">
              {listing.title}
            </p>
            <div className="flex items-center gap-1 text-xs text-[#64748B] mt-1">
              <FiMapPin className="w-3 h-3 shrink-0" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <FaStar key={i} className="w-3 h-3 text-amber-400" />
              ))}
              <FaStar className="w-3 h-3 text-amber-300" />
              <span className="text-xs text-[#64748B] ml-1">
                {listing.rating} ({listing.reviews})
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="font-bold text-lg leading-tight" style={{ color: "#2563EB" }}>
              {listing.price}
              <span className="text-xs font-normal text-[#64748B] ml-0.5">
                $/jour
              </span>
            </span>
            <button
              className="mt-2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                border: "1px solid rgba(147,197,253,0.70)",
                background:
                  "linear-gradient(135deg, rgba(239,246,255,0.95), rgba(219,234,254,0.90))",
                boxShadow: "0 2px 10px rgba(37,99,235,0.20)",
              }}
            >
              <FaHeart className="w-3.5 h-3.5 text-[#2563EB]" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 pb-4 shrink-0">
          {listings.map((_, i) => (
            <div
              key={i}
              style={{
                height: "6px",
                width: i === index ? "20px" : "6px",
                borderRadius: "99px",
                background:
                  i === index
                    ? "linear-gradient(90deg, #2563EB, #60A5FA)"
                    : "rgba(191,219,254,0.70)",
                boxShadow: i === index ? "0 0 8px rgba(37,99,235,0.50)" : "none",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────────────────── */

export default function LouerUneRemorquePage() {
  const stackCards = listings.map((listing, i) => (
    <ListingCard key={i} listing={listing} index={i} />
  ));

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      <Helmet>
        <title>Louer une remorque au Québec | Lorepa.ca</title>
        <meta name="description" content="Loue une remorque près de chez toi partout au Québec. Déménagement, rénovation, transport. Réserve facilement sur Lorepa.ca, la plateforme 100% québécoise." />
        <link rel="canonical" href="https://lorepa.ca/louer-une-remorque" />
      </Helmet>

      {/* ══ GLOBAL BACKGROUND ══════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 75% at 0% 0%, #bdd8f8 0%, #cfe3fb 18%, #e2effd 42%, #f5f9ff 65%, #ffffff 100%)",
        }}
      />

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-14 lg:py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 w-full">

          {/* Floating glass badge */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 mb-8 lg:mb-14"
            style={{
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.65)",
              borderRadius: "16px",
              padding: "10px 18px",
              boxShadow:
                "0 4px 20px rgba(37,99,235,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <img src={LogoCropped} alt="Lorepa" className="h-8 w-auto" />
            <span className="text-sm font-medium text-slate-600 tracking-tight">
              Plateforme 100% québécoise
            </span>
          </Link>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {/* ── Left: Text ── */}
            <div>
              <h1
                className="font-extrabold tracking-tight text-[#0F172A] leading-[1.04] mb-7"
                style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
              >
                Loue une remorque
                <br />
                près de chez toi —
                <br />
                <span style={{ color: "#2563EB" }}>dès aujourd'hui</span>
              </h1>

              <p className="text-[#64748B] text-lg leading-relaxed max-w-[510px] mb-10">
                Des remorques disponibles partout au Québec, louées par des
                voisins. Déménagement, rénovation, transport — trouve ce
                qu'il te faut en quelques clics.
              </p>

              <Link
                to="/who#signin-signup"
                className="flex sm:inline-flex items-center justify-center gap-3 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "#2563EB",
                  padding: "16px 28px",
                  fontSize: "15px",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.38)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1d4ed8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2563EB")
                }
                onClick={() => window.gtag?.('event', 'conversion', { send_to: 'AW-18220478445/CONVERSION_LABEL' })}
              >
                Créer mon compte gratuitement
                <FiArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-[#94A3B8] text-sm mt-4 tracking-wide">
                Gratuit · Sans engagement · Réservation rapide
              </p>
            </div>

            {/* ── Right: Stack of glassmorphism listing cards ── */}
            <div className="flex justify-center lg:justify-end">
              <div
                style={{
                  width: "clamp(220px, 68vw, 460px)",
                  height: "clamp(510px, 65vw, 650px)",
                  paddingRight: "min(70px, 10vw)",
                  paddingBottom: "min(70px, 10vw)",
                  position: "relative",
                  clipPath: "inset(0)",
                }}
              >
                <Stack
                  cards={stackCards}
                  randomRotation={false}
                  sensitivity={160}
                  sendToBackOnClick={true}
                  autoplay={true}
                  autoplayDelay={3200}
                  pauseOnHover={true}
                  mobileClickOnly={true}
                  animationConfig={{ stiffness: 220, damping: 24 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST STATS ════════════════════════════════════════════════════ */}
      <section className="px-6 pb-14 lg:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* ── Stat 1: Trailers ── */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.03 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0, type: "spring", stiffness: 260, damping: 22 }}
              className="flex flex-col items-center text-center rounded-[30px] py-11 px-7 relative overflow-hidden cursor-default"
              style={{
                background: "linear-gradient(145deg, rgba(219,234,254,0.65) 0%, rgba(191,219,254,0.40) 40%, rgba(255,255,255,0.78) 75%)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1.5px solid rgba(147,197,253,0.52)",
                boxShadow: [
                  "0 0 0 1px rgba(255,255,255,0.65)",
                  "0 24px 64px rgba(37,99,235,0.18)",
                  "0 8px 24px rgba(37,99,235,0.10)",
                  "inset 0 1.5px 0 rgba(255,255,255,0.95)",
                  "inset 0 -1px 0 rgba(219,234,254,0.45)",
                ].join(", "),
              }}
            >
              {/* Aurora blob — top-left blue */}
              <div style={{
                position: "absolute", top: "-40px", left: "-40px",
                width: "200px", height: "200px", borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(96,165,250,0.50) 0%, rgba(59,130,246,0.22) 45%, transparent 70%)",
                pointerEvents: "none",
              }} />
              {/* Prismatic top edge */}
              <div style={{
                position: "absolute", top: 0, left: "12%", right: "12%", height: "1.5px",
                background: "linear-gradient(90deg, transparent, rgba(147,197,253,0.90) 30%, rgba(255,255,255,1) 50%, rgba(147,197,253,0.90) 70%, transparent)",
                pointerEvents: "none",
              }} />

              <div className="flex items-center justify-center mb-5 rounded-2xl relative z-10" style={{
                width: "62px", height: "62px",
                background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                boxShadow: "0 8px 28px rgba(37,99,235,0.40), inset 0 1px 0 rgba(255,255,255,0.28)",
              }}>
                <BoxesIcon size={28} color="#fff" isAnimated={true} duration={1200} />
              </div>

              <p className="font-extrabold tracking-tight leading-none mb-3 relative z-10" style={{
                fontSize: "clamp(42px, 5vw, 60px)",
                background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 55%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                <CountUp to={15} suffix="+" duration={1.8} />
              </p>
              <p className="text-[#475569] text-sm font-semibold tracking-wide relative z-10">
                Remorques disponibles
              </p>
            </motion.div>

            {/* ── Stat 2: Rating ── */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.03 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.12, type: "spring", stiffness: 260, damping: 22 }}
              className="flex flex-col items-center text-center rounded-[30px] py-11 px-7 relative overflow-hidden cursor-default"
              style={{
                background: "linear-gradient(145deg, rgba(224,231,255,0.65) 0%, rgba(199,210,254,0.40) 40%, rgba(255,255,255,0.78) 75%)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1.5px solid rgba(165,180,252,0.50)",
                boxShadow: [
                  "0 0 0 1px rgba(255,255,255,0.65)",
                  "0 24px 64px rgba(99,102,241,0.18)",
                  "0 8px 24px rgba(99,102,241,0.10)",
                  "inset 0 1.5px 0 rgba(255,255,255,0.95)",
                  "inset 0 -1px 0 rgba(224,231,255,0.45)",
                ].join(", "),
              }}
            >
              {/* Aurora blob — top-right indigo */}
              <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "200px", height: "200px", borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(129,140,248,0.52) 0%, rgba(99,102,241,0.22) 45%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: 0, left: "12%", right: "12%", height: "1.5px",
                background: "linear-gradient(90deg, transparent, rgba(165,180,252,0.90) 30%, rgba(255,255,255,1) 50%, rgba(165,180,252,0.90) 70%, transparent)",
                pointerEvents: "none",
              }} />

              <div className="flex items-center justify-center mb-5 rounded-2xl relative z-10" style={{
                width: "62px", height: "62px",
                background: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)",
                boxShadow: "0 8px 28px rgba(99,102,241,0.40), inset 0 1px 0 rgba(255,255,255,0.28)",
              }}>
                <StarIcon size={28} color="#fff" isAnimated={true} duration={1200} />
              </div>

              <p className="font-extrabold tracking-tight leading-none mb-3 relative z-10" style={{
                fontSize: "clamp(42px, 5vw, 60px)",
                background: "linear-gradient(135deg, #3730A3 0%, #4F46E5 55%, #818CF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                <CountUp to={4.8} decimals={1} suffix="★" duration={1.8} />
              </p>
              <p className="text-[#475569] text-sm font-semibold tracking-wide relative z-10">
                Note moyenne
              </p>
            </motion.div>

            {/* ── Stat 3: Quebec ── */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.03 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.24, type: "spring", stiffness: 260, damping: 22 }}
              className="flex flex-col items-center text-center rounded-[30px] py-11 px-7 relative overflow-hidden cursor-default"
              style={{
                background: "linear-gradient(145deg, rgba(207,250,254,0.60) 0%, rgba(164,243,252,0.32) 40%, rgba(255,255,255,0.78) 75%)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1.5px solid rgba(103,232,249,0.45)",
                boxShadow: [
                  "0 0 0 1px rgba(255,255,255,0.65)",
                  "0 24px 64px rgba(6,182,212,0.16)",
                  "0 8px 24px rgba(6,182,212,0.10)",
                  "inset 0 1.5px 0 rgba(255,255,255,0.95)",
                  "inset 0 -1px 0 rgba(207,250,254,0.45)",
                ].join(", "),
              }}
            >
              {/* Aurora blob — bottom cyan */}
              <div style={{
                position: "absolute", bottom: "-40px", left: "50%", transform: "translateX(-50%)",
                width: "220px", height: "180px", borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(34,211,238,0.48) 0%, rgba(6,182,212,0.20) 45%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: 0, left: "12%", right: "12%", height: "1.5px",
                background: "linear-gradient(90deg, transparent, rgba(103,232,249,0.90) 30%, rgba(255,255,255,1) 50%, rgba(103,232,249,0.90) 70%, transparent)",
                pointerEvents: "none",
              }} />

              <div className="flex items-center justify-center mb-5 rounded-2xl relative z-10" style={{
                width: "62px", height: "62px",
                background: "linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)",
                boxShadow: "0 8px 28px rgba(6,182,212,0.42), inset 0 1px 0 rgba(255,255,255,0.28)",
              }}>
                <CompassIcon size={28} color="#fff" isAnimated={true} duration={1200} />
              </div>

              <p className="font-extrabold tracking-tight leading-none mb-3 relative z-10" style={{
                fontSize: "clamp(42px, 5vw, 60px)",
                background: "linear-gradient(135deg, #0E7490 0%, #0891B2 55%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                QC
              </p>
              <p className="text-[#475569] text-sm font-semibold tracking-wide relative z-10">
                Partout au Québec
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-[36px] lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight mb-2">
              Comment ça marche ?
            </h2>
            <p className="text-[#64748B] text-base">
              Loue une remorque en 3 étapes simples.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center rounded-[20px] px-7 py-10"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(226,232,240,0.8)",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Step badge */}
                <div
                  className="absolute top-5 left-5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "#2563EB" }}
                >
                  {item.step}
                </div>

                {/* Icon circle */}
                <div
                  className="flex items-center justify-center mb-5 rounded-full"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                    border: "1px solid rgba(147,197,253,0.40)",
                  }}
                >
                  {item.icon}
                </div>

                <h3 className="font-bold text-[#0F172A] text-[17px] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ USE CASES ═══════════════════════════════════════════════════════ */}
      <section className="px-6 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#0F172A] text-center tracking-tight mb-14">
            Pour tous tes besoins
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((item, i) => (
              <UseCaseCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[24px] lg:rounded-[36px]"
            style={{
              background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 35%, #2563EB 60%, #3B82F6 100%)",
              boxShadow: "0 32px 80px rgba(37,99,235,0.45), 0 8px 32px rgba(37,99,235,0.30)",
            }}
          >
            {/* ── Decorative orbs ── */}
            <div style={{
              position: "absolute", top: "-80px", right: "-80px",
              width: "360px", height: "360px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(96,165,250,0.35) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-60px", left: "-60px",
              width: "300px", height: "300px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(147,197,253,0.25) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "38%",
              width: "200px", height: "200px", borderRadius: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* ── Mesh grid overlay ── */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              backgroundImage: [
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "48px 48px",
              pointerEvents: "none",
            }} />

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 px-6 sm:px-10 lg:px-16 py-10 lg:py-16">

              {/* Left text */}
              <div className="text-center lg:text-left max-w-xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <FiMapPin className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-semibold tracking-wide">Disponible partout au Québec</span>
                </div>

                <h2
                  className="font-extrabold text-white leading-[1.08] tracking-tight mb-5"
                  style={{ fontSize: "clamp(26px, 4.5vw, 54px)" }}
                >
                  Trouve la remorque
                  <br />
                  <span style={{
                    background: "linear-gradient(90deg, #BAE6FD, #E0F2FE)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    parfaite dès maintenant
                  </span>
                </h2>

                <p className="text-blue-200 text-base leading-relaxed max-w-md">
                  Rejoins des milliers de Québécois qui louent localement et économisent chaque jour.
                </p>
              </div>

              {/* Right: CTA block */}
              <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
                <Link
                  to="/trailers"
                  className="flex sm:inline-flex items-center justify-center gap-3 font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-center"
                  style={{
                    background: "#ffffff",
                    color: "#1D4ED8",
                    padding: "16px 28px",
                    fontSize: "15px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                  onClick={() => window.gtag?.('event', 'conversion', { send_to: 'AW-18220478445/CONVERSION_LABEL' })}
                >
                  Voir les remorques disponibles
                  <FiArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-blue-200 text-xs">
                  Gratuit · Sans engagement · Réservation rapide
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
