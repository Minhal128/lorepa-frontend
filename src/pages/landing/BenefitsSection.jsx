import { motion } from 'framer-motion';
import { LuDollarSign, LuCalendarDays, LuShieldCheck, LuMapPin } from 'react-icons/lu';

const benefits = [
  {
    Icon: LuDollarSign,
    title: 'Tu fixes ton prix',
    desc: 'Ajuste selon la saison et la demande',
  },
  {
    Icon: LuCalendarDays,
    title: 'Tu choisis tes dispo',
    desc: 'Loue seulement quand tu veux',
  },
  {
    Icon: LuShieldCheck,
    title: 'Assurance incluse',
    desc: 'Ta remorque est protégée pendant la location',
  },
  {
    Icon: LuMapPin,
    title: 'Locataires près de toi',
    desc: 'Ils viennent chercher la remorque chez toi',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' } },
};

const BenefitsSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-5xl mx-auto">

      <motion.h2
        className="text-2xl sm:text-3xl lg:text-[2.15rem] font-black text-slate-900 text-center mb-12 leading-tight"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        Pourquoi louer votre remorque sur Lorepa ?
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {benefits.map(({ Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={cardVariants}
            /* shiny gradient border via padding trick */
            className="group relative rounded-[24px] p-[1.5px] bg-gradient-to-br from-blue-400/50 via-slate-100 to-blue-200/40 hover:from-blue-500/80 hover:via-blue-300/30 hover:to-blue-500/60 transition-all duration-400 shadow-[0_2px_16px_rgba(37,99,235,0.08)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.18)] hover:-translate-y-2 cursor-default"
          >
            {/* card inner */}
            <div className="flex items-start gap-5 bg-white rounded-[22.5px] p-6 h-full group-hover:bg-slate-50/40 transition-colors duration-300">

              {/* icon badge */}
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.38)] group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>

              <div>
                <h3 className="text-slate-900 font-bold text-[1.05rem] mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
);

export default BenefitsSection;
