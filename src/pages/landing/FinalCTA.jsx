import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuUsers, LuMapPin, LuCircleDollarSign, LuStar } from 'react-icons/lu';

/* ── animated counter ── */
const CountUp = ({ end, decimals = 0, suffix = '', duration = 2.2 }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(+(eased * end).toFixed(decimals));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, decimals, duration]);

  const display =
    decimals > 0
      ? value.toFixed(decimals)
      : value.toLocaleString('fr-CA');

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

const stats = [
  { Icon: LuUsers,             end: 18,    suffix: '+',   label: 'Propriétaires inscrits', color: 'text-blue-600' },
  { Icon: LuMapPin,            end: 60,    suffix: '+',   label: 'Locations complétées',   color: 'text-blue-600' },
  { Icon: LuCircleDollarSign,  end: 10000, suffix: ' $+', label: 'Revenus générés',        color: 'text-blue-600' },
  { Icon: LuStar,              end: 4.9,   decimals: 1, suffix: '/5', label: 'Satisfaction moyenne', color: 'text-amber-400' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const FinalCTA = () => (
  <>
    {/* ── CTA banner ── */}
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-[28px] px-8 py-10 sm:px-12 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/[0.07] blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 right-24 w-56 h-56 rounded-full bg-blue-300/20 blur-[70px] pointer-events-none" />

          {/* text */}
          <div className="relative z-10 text-center sm:text-left max-w-md">
            <h2 className="text-[1.65rem] sm:text-[2rem] font-black text-white leading-[1.15] mb-3">
              Commence à rentabiliser<br />
              ta remorque dès aujourd'hui
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              L'inscription est gratuite et prend moins de 5 minutes.
            </p>
          </div>

          {/* button */}
          <motion.div
            className="relative z-10 flex-shrink-0"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1.5 bg-white text-blue-600 font-bold rounded-full px-8 py-4 text-[0.95rem] shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              Commencer à gagner de l'argent →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* ── Stats row ── */}
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ Icon, end, decimals = 0, suffix, label, color }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center gap-3 text-center"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {/* icon circle */}
              <div className="w-14 h-14 rounded-full border-2 border-blue-100 bg-blue-50 flex items-center justify-center shadow-sm">
                <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.75} />
              </div>

              {/* animated number */}
              <p className="text-[1.75rem] font-black text-slate-900 leading-none tracking-tight">
                <CountUp end={end} decimals={decimals} suffix={suffix} />
              </p>

              <p className="text-slate-500 text-sm leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default FinalCTA;
