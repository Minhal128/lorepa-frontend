import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { LuTruck, LuPackage, LuLayers, LuHardHat, LuCar } from 'react-icons/lu';

/* ── Trailer types ── */
const TRAILERS = [
  { id: 'utilitaire', label: 'Utilitaire', Icon: LuTruck,   rate: 60,  desc: 'Déménagements et travaux légers' },
  { id: 'fermee',     label: 'Fermée',     Icon: LuPackage, rate: 100, desc: 'Marchandises protégées des intempéries' },
  { id: 'plateforme', label: 'Plateforme', Icon: LuLayers,  rate: 120, desc: 'Équipements lourds, machinerie' },
  { id: 'dompeur',    label: 'Dompeuse',   Icon: LuHardHat, rate: 95,  desc: 'Déchets et matériaux en vrac' },
  { id: 'voiture',    label: 'Voiture',    Icon: LuCar,     rate: 125, desc: 'Transport de véhicules' },
];

/* ── Discount tiers ── */
const getDiscount   = (d) => d >= 7 ? 0.85 : d >= 5 ? 0.90 : d >= 3 ? 0.95 : 1.00;
const getDiscountPct = (d) => d >= 7 ? 15   : d >= 5 ? 10   : d >= 3 ? 5    : 0;
const getBarColor   = (d) => d >= 7 ? '#10b981' : d >= 5 ? '#3b82f6' : d >= 3 ? '#8b5cf6' : '#94a3b8';

const TIER_BADGE = {
  0:  { bg: 'bg-slate-100',   text: 'text-slate-500',   label: 'Aucun rabais',  sub: '< 3 jours'   },
  5:  { bg: 'bg-violet-100',  text: 'text-violet-700',  label: 'Rabais –5 %',   sub: '3–4 jours'   },
  10: { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Rabais –10 %',  sub: '5–6 jours'   },
  15: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Rabais –15 %',  sub: '7+ jours'    },
};

const CHART_DAYS = [1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30];

const fmt = (n) => Math.round(n).toLocaleString('fr-CA');

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 text-sm">
      <p className="font-bold text-slate-700 mb-0.5">{label} de location</p>
      <p className="text-blue-600 font-black text-base">{fmt(payload[0].value)} $</p>
    </div>
  );
};

/* ── Main component ── */
const CalculatorPage = () => {
  const [trailer, setTrailer] = useState(TRAILERS[0]);
  const [days, setDays]       = useState(5);

  const discount   = getDiscount(days);
  const discountPct = getDiscountPct(days);
  const gross      = trailer.rate * days;
  const income     = Math.round(gross * discount);
  const savings    = Math.round(gross - income);
  const badge      = TIER_BADGE[discountPct];

  /* rentals that fit in a month at current duration */
  const rentalsPerMonth = Math.max(1, Math.floor(30 / days));
  const monthly         = income * rentalsPerMonth;
  const annual          = monthly * 12;

  /* bar chart data for selected trailer */
  const chartData = useMemo(
    () => CHART_DAYS.map((d) => ({
      jours: d,
      revenu: Math.round(trailer.rate * d * getDiscount(d)),
      label: `${d}j`,
    })),
    [trailer.rate],
  );

  /* slider thumb position for the discount threshold markers */
  const sliderPct = ((days - 1) / 29) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 flex flex-col">
      <style>{`
        .lorepa-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          cursor: pointer;
        }
        .lorepa-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 0; height: 0; }
        .lorepa-slider::-moz-range-thumb { width: 0; height: 0; border: none; }
        .lorepa-slider::-moz-range-track { background: transparent; }
      `}</style>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 px-4 pt-14 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold mb-4">
            💰 Calculateur de revenus
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
            Combien peut rapporter<br className="hidden sm:block" /> votre remorque&nbsp;?
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            Sélectionnez votre type de remorque, ajustez la durée et visualisez vos revenus en temps réel.
          </p>
        </motion.div>
      </section>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ══ LEFT: Controls + Chart ══ */}
          <div className="space-y-6">

            {/* Trailer type cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.07)]"
            >
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Type de remorque
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {TRAILERS.map((t) => {
                  const active = trailer.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTrailer(t)}
                      className={`group flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border-2 transition-all duration-200 text-center
                        ${active
                          ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                    >
                      <t.Icon
                        className={`w-6 h-6 transition-colors ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-400'}`}
                        strokeWidth={1.75}
                      />
                      <span className={`text-xs font-bold leading-tight ${active ? 'text-blue-700' : 'text-slate-700'}`}>
                        {t.label}
                      </span>
                      <span className={`text-[11px] font-semibold ${active ? 'text-blue-500' : 'text-slate-400'}`}>
                        {t.rate}&nbsp;$/jour
                      </span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={trailer.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-slate-400 mt-4 text-center"
                >
                  {trailer.desc}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Days slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.07)]"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Durée de location
                </h2>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={discountPct}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`text-xs font-bold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}
                  >
                    {badge.label} · {badge.sub}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-5">
                <div className="min-w-[5rem] text-center flex-shrink-0">
                  <span className="text-5xl font-black text-blue-600 leading-none tabular-nums">{days}</span>
                  <p className="text-xs text-slate-400 mt-0.5">jour{days > 1 ? 's' : ''}</p>
                </div>

                <div className="flex-1">
                  {/* Custom slider track */}
                  <div className="relative flex items-center h-6">
                    {/* Full track (grey) */}
                    <div className="absolute w-full h-[6px] bg-slate-300 rounded-full" />
                    {/* Filled track (blue) */}
                    <div
                      className="absolute h-[6px] bg-blue-600 rounded-full"
                      style={{ width: `${sliderPct}%` }}
                    />
                    {/* Thumb */}
                    <div
                      className="absolute w-[22px] h-[22px] bg-blue-600 rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(37,99,235,0.5)] pointer-events-none"
                      style={{ left: `calc(${sliderPct}% - 11px)` }}
                    />
                    {/* Native input — invisible, handles all interaction */}
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="lorepa-slider absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {/* Day markers: tick at every day, number at key days */}
                  <div className="relative h-6 mt-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const pct      = ((day - 1) / 29) * 100;
                      const isEdgeL  = day === 1;
                      const isEdgeR  = day === 30;
                      const isThr    = [3, 5, 7].includes(day);
                      const showNum  = [1, 3, 5, 7, 10, 15, 20, 25, 30].includes(day);
                      const tickColor = day === 3 ? '#8b5cf6' : day === 5 ? '#3b82f6' : day === 7 ? '#10b981' : '#cbd5e1';
                      const numColor  = day === 3 ? '#8b5cf6' : day === 5 ? '#3b82f6' : day === 7 ? '#10b981' : '#94a3b8';
                      const active    = days >= day;

                      const posStyle = isEdgeL
                        ? { left: 0 }
                        : isEdgeR
                        ? { right: 0 }
                        : { left: `${pct}%`, transform: 'translateX(-50%)' };

                      return (
                        <div
                          key={day}
                          style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: active ? 1 : 0.3, transition: 'opacity 0.15s', ...posStyle }}
                        >
                          {/* tick */}
                          <div style={{ width: isThr ? 2 : 1, height: isThr ? 6 : 4, borderRadius: 1, backgroundColor: tickColor }} />
                          {/* number */}
                          {showNum && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: numColor, lineHeight: 1, marginTop: 2 }}>
                              {day}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Discount tier row */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className={`rounded-xl py-2 px-1 border transition-all duration-200 ${discountPct === 5 ? 'border-violet-300 bg-violet-50' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                  <p className={`text-sm font-black ${discountPct === 5 ? 'text-violet-600' : 'text-slate-400'}`}>–5&nbsp;%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">3–4 jours</p>
                </div>
                <div className={`rounded-xl py-2 px-1 border transition-all duration-200 ${discountPct === 10 ? 'border-blue-300 bg-blue-50' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                  <p className={`text-sm font-black ${discountPct === 10 ? 'text-blue-600' : 'text-slate-400'}`}>–10&nbsp;%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">5–6 jours</p>
                </div>
                <div className={`rounded-xl py-2 px-1 border transition-all duration-200 ${discountPct === 15 ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                  <p className={`text-sm font-black ${discountPct === 15 ? 'text-emerald-600' : 'text-slate-400'}`}>–15&nbsp;%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">7+ jours</p>
                </div>
              </div>
            </motion.div>

            {/* Bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.07)]"
            >
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Revenus selon la durée
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-5">
                Remorque {trailer.label} · {trailer.rate}$/jour · rabais multi-jours inclus
              </p>

              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={chartData} barSize={22} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}$`}
                    width={46}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.7)', radius: 6 }} />
                  <ReferenceLine x="3j" strokeDasharray="4 3" stroke="#8b5cf6" strokeWidth={1.5} />
                  <ReferenceLine x="5j" strokeDasharray="4 3" stroke="#3b82f6" strokeWidth={1.5} />
                  <ReferenceLine x="7j" strokeDasharray="4 3" stroke="#10b981" strokeWidth={1.5} />
                  <Bar dataKey="revenu" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.jours}
                        fill={getBarColor(entry.jours)}
                        opacity={entry.jours === days ? 1 : 0.65}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
                {[
                  { color: 'bg-slate-300',  label: '1–2 jours (taux normal)' },
                  { color: 'bg-violet-400', label: '3–4 jours (–5 %)' },
                  { color: 'bg-blue-400',   label: '5–6 jours (–10 %)' },
                  { color: 'bg-emerald-400',label: '7+ jours (–15 %)' },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className={`w-2.5 h-2.5 rounded-sm inline-block ${l.color}`} />
                    {l.label}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ══ RIGHT: Results ══ */}
          <motion.div
            className="space-y-5 lg:sticky lg:top-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Main result */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-7 text-white shadow-[0_8px_32px_rgba(37,99,235,0.35)]">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">
                Revenu estimé
              </p>
              <motion.p
                key={income}
                className="text-5xl font-black leading-none"
                initial={{ scale: 0.92, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {fmt(income)}&nbsp;$
              </motion.p>
              <p className="text-blue-200 text-sm mt-2">
                {days}&nbsp;jour{days > 1 ? 's' : ''}&nbsp;·&nbsp;{trailer.label}
              </p>

              {savings > 0 && (
                <motion.div
                  key={savings}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 bg-white/15 rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-blue-100">Économie accordée</span>
                  <span className="font-bold text-white">–{fmt(savings)}&nbsp;$</span>
                </motion.div>
              )}

              <div className="mt-3 bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-blue-200">Prix sans rabais</span>
                <span className={`text-sm font-medium ${savings > 0 ? 'line-through text-blue-300' : 'text-white'}`}>
                  {fmt(gross)}&nbsp;$
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.07)] space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Détails du calcul
              </h3>

              {[
                { label: 'Tarif journalier', value: `${trailer.rate} $/jour` },
                { label: 'Nombre de jours',  value: `${days} jour${days > 1 ? 's' : ''}` },
                { label: 'Sous-total',        value: `${fmt(gross)} $` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-semibold text-slate-800">{row.value}</span>
                </div>
              ))}

              {discountPct > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 bg-emerald-50 -mx-1 px-3 py-2 rounded-lg">
                  <span className="font-medium">Rabais multi-jours</span>
                  <span className="font-bold">–{discountPct}&nbsp;%</span>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base">
                <span className="text-slate-800">Total</span>
                <span className="text-blue-600">{fmt(income)}&nbsp;$</span>
              </div>
            </div>

            {/* Monthly projection */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.07)]">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Projection mensuelle
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Locations / mois</span>
                  <span className="font-semibold text-slate-800">~{rentalsPerMonth}&times;</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Revenu mensuel est.</span>
                  <motion.span
                    key={monthly}
                    initial={{ opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    className="font-bold text-blue-600"
                  >
                    {fmt(monthly)}&nbsp;$
                  </motion.span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="text-sm text-slate-500">Revenu annuel est.</span>
                  <motion.span
                    key={annual}
                    initial={{ opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    className="font-black text-slate-800 text-base"
                  >
                    {fmt(annual)}&nbsp;$
                  </motion.span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/mettre-en-location"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(37,99,235,0.42)] shadow-[0_4px_16px_rgba(37,99,235,0.32)]"
            >
              Inscrire ma remorque gratuitement&nbsp;→
            </a>

            <p className="text-center text-[10px] text-slate-400 leading-snug px-2">
              Estimation basée sur les prix des locations réalisées par les propriétaires en 2026. Les résultats réels peuvent varier.
            </p>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorPage;
