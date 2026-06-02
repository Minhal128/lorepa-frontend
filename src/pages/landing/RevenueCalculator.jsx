import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuTruck, LuMapPin, LuChevronDown } from 'react-icons/lu';

/* ── data (sourced from CalculatorPage.jsx daily rates) ── */
const TRAILER_TYPES = [
  { id: 'utilitaire', label: 'Remorque utilitaire',  rate: 55  },
  { id: 'fermee',     label: 'Remorque fermée',       rate: 80  },
  { id: 'plateforme', label: 'Plateforme',             rate: 100 },
  { id: 'dompeur',    label: 'Dompeur',                rate: 115 },
  { id: 'bateau',     label: 'Remorque bateau',        rate: 65  },
  { id: 'voiture',    label: 'Transport voiture',      rate: 90  },
];

const LOCATIONS = [
  { id: 'montreal',   label: 'Montréal, QC',  mult: 1.00 },
  { id: 'laval',      label: 'Laval, QC',      mult: 0.95 },
  { id: 'longueuil',  label: 'Longueuil, QC', mult: 0.92 },
  { id: 'quebec',     label: 'Québec, QC',     mult: 0.90 },
  { id: 'sherbrooke', label: 'Sherbrooke, QC', mult: 0.85 },
  { id: 'gatineau',   label: 'Gatineau, QC',   mult: 0.88 },
];

/* Platform-average daily rate per type (used for the "+X% vs average" comparison) */
const AVG_RATE = { utilitaire: 50, fermee: 73, plateforme: 90, dompeur: 107, bateau: 59, voiture: 83 };

/* Platform average occupancy (70%) – used to convert "available days" to "booked days" */
const OCCUPANCY = 0.70;

/* Discount tiers matching CalculatorPage.jsx */
const getDiscount = (days) => {
  if (days >= 7) return 0.85;
  if (days >= 5) return 0.90;
  if (days >= 3) return 0.95;
  return 1;
};

/* ── animated donut (white on blue) ── */
const Donut = ({ pct }) => {
  const size = 160, r = 62;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.18)" strokeWidth="11" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="white" strokeWidth="11" fill="none"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 text-center">
        <motion.p
          key={pct}
          className="text-white font-black text-4xl leading-none"
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {pct}%
        </motion.p>
        <p className="text-blue-200 text-xs leading-tight mt-1.5">Taux<br />d'occupation</p>
      </div>
    </div>
  );
};

/* ── (ResultNumber inlined for responsive sizing) ── */
const _unused = ({ value, fmt }) => (
  <motion.p key={value} className="text-white font-black text-[3rem] leading-none tracking-tight" initial={{ scale: 0.9, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.22 }}>
    {fmt(value)}&nbsp;$
  </motion.p>
);

/* ── stepper input ── */
const Stepper = ({ label, value, onDec, onInc }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 h-12 gap-2 shadow-sm hover:border-blue-300 transition-colors">
      <span className="text-slate-800 font-semibold text-sm flex-1 text-center tabular-nums">{value}</span>
      <div className="flex flex-col gap-[3px]">
        <button
          onClick={onDec}
          className="w-7 h-[18px] rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-500 text-[11px] flex items-center justify-center font-bold transition-colors select-none"
        >−</button>
        <button
          onClick={onInc}
          className="w-7 h-[18px] rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-500 text-[11px] flex items-center justify-center font-bold transition-colors select-none"
        >+</button>
      </div>
    </div>
  </div>
);

/* ── select dropdown ── */
const SelectControl = ({ label, value, onChange, options, Icon }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
    <div className="relative shadow-sm">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" strokeWidth={1.75} />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-white border border-slate-200 rounded-2xl h-12 ${Icon ? 'pl-9' : 'pl-4'} pr-9 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400/40 cursor-pointer hover:border-blue-300 transition-colors`}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
      <LuChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        strokeWidth={1.75}
      />
    </div>
  </div>
);

/* ── main component ── */
const RevenueCalculator = () => {
  const [trailerType, setTrailerType] = useState('utilitaire');
  const [location,    setLocation]    = useState('montreal');
  const [pricePerDay, setPricePerDay] = useState(55);
  const [daysAvail,   setDaysAvail]   = useState(10);

  /* When trailer type changes, suggest the type's default daily rate */
  useEffect(() => {
    const t = TRAILER_TYPES.find((t) => t.id === trailerType);
    if (t) setPricePerDay(t.rate);
  }, [trailerType]);

  /* ── calculations (mirrors CalculatorPage logic) ── */
  const locMult    = LOCATIONS.find((l) => l.id === location)?.mult ?? 1;
  const bookedDays = Math.round(daysAvail * OCCUPANCY);          // ~70% of available days
  const discount   = getDiscount(bookedDays);                    // volume discount
  const monthly    = Math.round(pricePerDay * bookedDays * discount * locMult);
  const annual     = monthly * 12;
  const occupancy  = Math.round(OCCUPANCY * 100);                // platform avg 70%

  /* comparison vs platform average owner */
  const avgRate    = AVG_RATE[trailerType] ?? 55;
  const avgMonthly = Math.round(avgRate * bookedDays * getDiscount(bookedDays));
  const vsAvgPct   = avgMonthly > 0 ? Math.round(((monthly - avgMonthly) / avgMonthly) * 100) : 0;

  const fmt = (n) => n.toLocaleString('fr-CA');

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto">

        {/* section header */}
        <motion.div
          className="text-center mb-7 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-2">
            Combien votre remorque peut-elle rapporter&nbsp;?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Utilisez notre calculateur pour estimer vos revenus mensuels potentiels
          </p>
        </motion.div>

        {/* unified card */}
        <motion.div
          className="bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_4px_6px_rgba(0,0,0,0.04),0_12px_50px_rgba(37,99,235,0.13)] overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >

          {/* ── controls row: 2-col on mobile, 4-col on lg ── */}
          <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <SelectControl
              label="Type de remorque"
              value={trailerType}
              onChange={setTrailerType}
              options={TRAILER_TYPES}
              Icon={LuTruck}
            />
            <SelectControl
              label="Localisation"
              value={location}
              onChange={setLocation}
              options={LOCATIONS}
              Icon={LuMapPin}
            />
            <Stepper
              label="Prix par jour ($)"
              value={pricePerDay}
              onDec={() => setPricePerDay((p) => Math.max(20, p - 5))}
              onInc={() => setPricePerDay((p) => Math.min(500, p + 5))}
            />
            <Stepper
              label="Jours disponibles / mois"
              value={daysAvail}
              onDec={() => setDaysAvail((d) => Math.max(1, d - 1))}
              onInc={() => setDaysAvail((d) => Math.min(30, d + 1))}
            />
          </div>

          {/* ── results panel (blue gradient) ── */}
          <div className="px-3 sm:px-5 lg:px-7 pb-5 sm:pb-7">
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-[18px] sm:rounded-[22px] px-5 sm:px-8 lg:px-10 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-around gap-5 sm:gap-8 shadow-[0_8px_30px_rgba(37,99,235,0.30)]">

              {/* monthly + donut side by side on mobile */}
              <div className="flex sm:contents items-center justify-around w-full gap-4 sm:gap-0">

                {/* monthly */}
                <div className="text-center flex-1 sm:flex-none">
                  <p className="text-blue-200 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 tracking-wide">Revenu mensuel estimé</p>
                  <motion.p
                    key={monthly}
                    className="text-white font-black text-[2rem] sm:text-[3rem] leading-none tracking-tight"
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.22 }}
                  >
                    {fmt(monthly)}&nbsp;$
                  </motion.p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {vsAvgPct >= 0 ? (
                      <>
                        <span className="text-green-300 font-bold text-xs sm:text-sm">↗ +{vsAvgPct}%</span>
                        <span className="text-blue-200 text-[10px] sm:text-xs">vs la moyenne</span>
                      </>
                    ) : (
                      <>
                        <span className="text-orange-300 font-bold text-xs sm:text-sm">↘ {vsAvgPct}%</span>
                        <span className="text-blue-200 text-[10px] sm:text-xs">vs la moyenne</span>
                      </>
                    )}
                  </div>
                </div>

                {/* donut — inline with monthly on mobile */}
                <div className="flex-shrink-0 scale-75 sm:scale-100 origin-center">
                  <Donut pct={occupancy} />
                </div>

              </div>

              {/* horizontal divider on mobile between the two halves */}
              <div className="w-full h-px bg-white/15 sm:hidden" />
              <div className="hidden sm:block h-20 w-px bg-white/20 flex-shrink-0" />

              {/* annual */}
              <div className="text-center w-full sm:w-auto">
                <p className="text-blue-200 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 tracking-wide">Revenu annuel estimé</p>
                <motion.p
                  key={annual}
                  className="text-white font-black text-[2rem] sm:text-[3rem] leading-none tracking-tight"
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.22 }}
                >
                  {fmt(annual)}&nbsp;$
                </motion.p>
                <p className="text-blue-200 text-[10px] sm:text-xs mt-2">
                  Basé sur {bookedDays * 12} jours&nbsp;/&nbsp;an
                </p>
              </div>

            </div>
          </div>

          {/* footer link */}
          <div className="px-4 sm:px-8 pb-5 sm:pb-7 flex items-center justify-center">
            <a
              href="/calculator"
              className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors group"
            >
              Voir le calculateur complet
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default RevenueCalculator;
