import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background blur orbs */}
      <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-300/25 blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-400/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-blue-100/30 blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10">

          {/* ── Left content (55%) ── */}
          <motion.div
            className="lg:w-[55%] w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm mb-6"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span className="text-base">💰</span>
              <span className="text-sm font-semibold text-slate-700">Revenu passif facile</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-black tracking-tight text-slate-900 leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Ta remorque inutilisée<br />
              peut te rapporter<br />
              jusqu'à{' '}
              <span className="text-blue-600">300 $/mois</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-slate-600 leading-relaxed text-lg sm:text-xl mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Mets ta remorque en location sur Lorepa.ca.
              Tu fixes ton prix, tes disponibilités. Des Québécois
              près de toi en ont besoin dès maintenant.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mb-8"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/mettre-en-location"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-full px-8 py-5 font-semibold text-lg hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all duration-300 shadow-[0_10px_40px_rgba(37,99,235,0.3)]"
                >
                  Inscrire ma remorque gratuitement →
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="flex flex-wrap gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {['Inscription gratuite', 'Tu gardes le contrôle', 'Assurance incluse'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                  <span className="text-slate-500 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right illustration (45%) ── */}
          <motion.div
            className="lg:w-[45%] w-full max-w-[520px] mx-auto lg:max-w-none"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(37,99,235,0.22)] aspect-[4/3]">
              <img
                src="/lorepa-hero-trailer-image.png"
                alt="Remorque utilitaire en location sur Lorepa"
                className="object-cover w-full h-full"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-blue-900/5 to-transparent pointer-events-none" />

              {/* Floating income cards */}
              <motion.div
                className="absolute top-4 left-4 backdrop-blur-xl bg-white/20 border border-white/35 rounded-3xl px-4 py-3 shadow-xl"
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-white font-bold text-lg leading-tight">+75 $</p>
                <p className="text-white/75 text-xs">Cette semaine</p>
              </motion.div>

              <motion.div
                className="absolute top-[88px] left-4 backdrop-blur-xl bg-white/20 border border-white/35 rounded-3xl px-4 py-3 shadow-xl"
                animate={{ y: [0, -11, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              >
                <p className="text-white font-bold text-lg leading-tight">+120 $</p>
                <p className="text-white/75 text-xs">Cette semaine</p>
              </motion.div>

              <motion.div
                className="absolute top-[172px] left-4 backdrop-blur-xl bg-white/20 border border-white/35 rounded-3xl px-4 py-3 shadow-xl"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
              >
                <p className="text-white font-bold text-lg leading-tight">+300 $/mois</p>
                <p className="text-white/75 text-xs">Revenu potentiel</p>
              </motion.div>

              {/* Revenue dashboard card */}
              <motion.div
                className="absolute bottom-5 right-5 backdrop-blur-xl bg-white/20 border border-white/30 rounded-[20px] p-4 shadow-2xl min-w-[170px]"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
              >
                <p className="text-white/70 text-xs mb-1">Revenus ce mois</p>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-white font-black text-[1.6rem] leading-none">+300 $</p>
                  <span className="bg-green-400/35 text-green-300 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">+32%</span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-[3px] h-9">
                  {[28, 42, 32, 55, 38, 62, 48, 70, 54, 82, 65, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/40 rounded-[3px]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="text-white/50 text-[10px] mt-1.5 text-center">vs mois dernier</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
