import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8">

      {/* blur orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-400/15 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-10">

          {/* ── Left content ── */}
          <motion.div
            className="lg:w-[55%] w-full text-center lg:text-left"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm mb-5"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <span className="text-base">💰</span>
              <span className="text-sm font-semibold text-slate-700">Revenu passif facile</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[2.1rem] leading-[1.12] sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-black tracking-tight text-slate-900 mb-5"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
            >
              Ta remorque inutilisée{' '}
              peut te rapporter{' '}
              jusqu'à{' '}
              <span className="text-blue-600 whitespace-nowrap">300 $/mois</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-slate-600 leading-relaxed text-base sm:text-lg lg:text-xl mb-7 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5 }}
            >
              Mets ta remorque en location sur Lorepa.ca.
              Tu fixes ton prix, tes disponibilités. Des Québécois
              près de toi en ont besoin dès maintenant.
            </motion.p>

            {/* CTA — full-width on mobile, auto on sm+ */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="mb-6"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/mettre-en-location"
                  className="flex sm:inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white rounded-full px-7 py-4 sm:px-8 sm:py-5 font-semibold text-base sm:text-lg hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(37,99,235,0.4)] transition-all duration-300 shadow-[0_8px_32px_rgba(37,99,235,0.3)]"
                >
                  Inscrire ma remorque gratuitement →
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.5 }}
            >
              {['Inscription gratuite', 'Tu gardes le contrôle', 'Assurance incluse'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                  <span className="text-slate-500 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right illustration ── */}
          <motion.div
            className="lg:w-[45%] w-full max-w-[480px] sm:max-w-[520px] mx-auto lg:max-w-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: 'easeOut' }}
          >
            <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_56px_rgba(37,99,235,0.22)] aspect-[4/3]">
              <img
                src="/lorepa-hero-trailer-image.png"
                alt="Remorque utilitaire en location sur Lorepa"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-blue-900/5 to-transparent pointer-events-none" />

              {/* Income card 1 — hidden on very small, scaled on mobile */}
              <motion.div
                className="absolute top-3 left-3 sm:top-4 sm:left-4 backdrop-blur-xl bg-white/20 border border-white/35 rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-4 sm:py-3 shadow-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-white font-bold text-sm sm:text-lg leading-tight">+75 $</p>
                <p className="text-white/75 text-[9px] sm:text-xs">Cette semaine</p>
              </motion.div>

              {/* Income card 2 — hide on mobile, show from sm */}
              <motion.div
                className="hidden sm:block absolute top-[88px] left-4 backdrop-blur-xl bg-white/20 border border-white/35 rounded-3xl px-4 py-3 shadow-xl"
                animate={{ y: [0, -11, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              >
                <p className="text-white font-bold text-lg leading-tight">+120 $</p>
                <p className="text-white/75 text-xs">Cette semaine</p>
              </motion.div>

              {/* Income card 3 — hide on mobile */}
              <motion.div
                className="hidden sm:block absolute top-[172px] left-4 backdrop-blur-xl bg-white/20 border border-white/35 rounded-3xl px-4 py-3 shadow-xl"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
              >
                <p className="text-white font-bold text-lg leading-tight">+300 $/mois</p>
                <p className="text-white/75 text-xs">Revenu potentiel</p>
              </motion.div>

              {/* Revenue dashboard — scaled down on mobile */}
              <motion.div
                className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 backdrop-blur-xl bg-white/20 border border-white/30 rounded-[16px] sm:rounded-[20px] p-3 sm:p-4 shadow-2xl min-w-[130px] sm:min-w-[160px]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
              >
                <p className="text-white/70 text-[9px] sm:text-xs mb-1">Revenus ce mois</p>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-white font-black text-xl sm:text-[1.6rem] leading-none">+300 $</p>
                  <span className="bg-green-400/35 text-green-300 text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">+32%</span>
                </div>
                <div className="flex items-end gap-[2px] sm:gap-[3px] h-7 sm:h-9">
                  {[28, 42, 32, 55, 38, 62, 48, 70, 54, 82, 65, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/40 rounded-[2px]" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="text-white/50 text-[9px] sm:text-[10px] mt-1 text-center">vs mois dernier</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
