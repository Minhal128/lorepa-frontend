import { useRef, useState, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/* ─── Card ─────────────────────────────────────────────────────────── */

export function Card({ card }) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);
  const id = useId();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside modal to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {/* ── Expanded overlay ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 200 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
              style={{ background: "rgba(5,15,30,0.72)", backdropFilter: "blur(10px)" }}
              onClick={() => setOpen(false)}
            />

            {/* Modal card */}
            <motion.div
              ref={modalRef}
              layoutId={`card-${id}`}
              className="relative w-full max-w-lg mx-4 rounded-3xl overflow-hidden"
              style={{ maxHeight: "85vh", background: "#0B1828", zIndex: 201 }}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}
              >
                <FiX className="w-4 h-4" />
              </button>

              {/* Hero image */}
              <motion.div layoutId={`image-${id}`} className="h-56 w-full overflow-hidden shrink-0">
                <img src={card.src} alt={card.title} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B1828]/80" style={{ top: "auto", height: "50%", bottom: 0, position: "absolute" }} />
              </motion.div>

              {/* Text */}
              <div className="p-7 overflow-y-auto" style={{ maxHeight: "calc(85vh - 224px)" }}>
                <motion.p
                  layoutId={`category-${id}`}
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#60A5FA" }}
                >
                  {card.category}
                </motion.p>
                <motion.h3
                  layoutId={`title-${id}`}
                  className="text-white text-2xl font-extrabold leading-snug mb-5"
                >
                  {card.title}
                </motion.h3>
                <div className="text-slate-300 text-sm leading-relaxed">
                  {card.content}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Collapsed card ── */}
      <motion.button
        layoutId={`card-${id}`}
        onClick={() => setOpen(true)}
        className="relative rounded-3xl overflow-hidden shrink-0 text-left group"
        style={{ width: "clamp(260px, 28vw, 320px)", height: "clamp(340px, 36vw, 420px)" }}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {/* Image */}
        <motion.div layoutId={`image-${id}`} className="absolute inset-0">
          <img src={card.src} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" draggable={false} />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(11,24,40,0.12) 0%, rgba(11,24,40,0.20) 40%, rgba(11,24,40,0.82) 100%)",
        }} />

        {/* Blue shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, transparent 60%)",
        }} />

        {/* Text at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.p
            layoutId={`category-${id}`}
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#93C5FD" }}
          >
            {card.category}
          </motion.p>
          <motion.h3
            layoutId={`title-${id}`}
            className="text-white text-lg font-extrabold leading-snug"
          >
            {card.title}
          </motion.h3>
        </div>

        {/* Corner glow badge */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0" style={{
          background: "rgba(37,99,235,0.85)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 16px rgba(37,99,235,0.5)",
        }}>
          <FiChevronRight className="w-4 h-4 text-white" />
        </div>
      </motion.button>
    </>
  );
}

/* ─── Carousel ─────────────────────────────────────────────────────── */

export function Carousel({ items, autoplay = true, autoplayInterval = 3200 }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const CARD_WIDTH = 340; // px including gap

  const check = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 2);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 2);
    setActiveIndex(Math.min(Math.round(scrollLeft / CARD_WIDTH), items.length - 1));
  }, [items.length]);

  useEffect(() => { check(); }, [check]);

  const scrollToIndex = useCallback((idx) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    scrollRef.current.scrollTo({ left: clamped * CARD_WIDTH, behavior: "smooth" });
  }, [items.length]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" });
  };

  // Autoplay loop
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      if (paused || !scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 10;
      if (atEnd) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
      }
    }, autoplayInterval);
    return () => clearInterval(id);
  }, [autoplay, autoplayInterval, paused]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards track */}
      <div
        ref={scrollRef}
        onScroll={check}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: "4px", paddingRight: "20px" }}
      >
        {items}
        <div className="shrink-0 w-4" />
      </div>

      {/* Bottom row: progress dots + nav buttons */}
      <div className="flex items-center justify-between mt-6 pr-1">

        {/* Progress dots */}
        <div className="flex items-center gap-2 pl-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === activeIndex ? "28px" : "8px",
                height: "8px",
                background: i === activeIndex
                  ? "linear-gradient(90deg, #2563EB, #60A5FA)"
                  : "rgba(37,99,235,0.20)",
                boxShadow: i === activeIndex ? "0 0 10px rgba(37,99,235,0.45)" : "none",
              }}
            />
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          {[{ dir: -1, icon: FiChevronLeft, can: canLeft }, { dir: 1, icon: FiChevronRight, can: canRight }].map(({ dir, icon: Icon, can }) => (
            <motion.button
              key={dir}
              onClick={() => scroll(dir)}
              disabled={!can}
              whileHover={can ? { scale: 1.08 } : {}}
              whileTap={can ? { scale: 0.95 } : {}}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: can ? "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(96,165,250,0.12))" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${can ? "rgba(37,99,235,0.40)" : "rgba(255,255,255,0.08)"}`,
                opacity: can ? 1 : 0.35,
                boxShadow: can ? "0 4px 16px rgba(37,99,235,0.14)" : "none",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: can ? "#60A5FA" : "#64748B" }} />
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
