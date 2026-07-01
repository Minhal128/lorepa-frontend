import { Helmet } from 'react-helmet-async';
import HeroSection from './HeroSection';
import RevenueCalculator from './RevenueCalculator';
import BenefitsSection from './BenefitsSection';
import FinalCTA from './FinalCTA';

const OwnerLandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>Louer sa remorque au Québec — Jusqu'à 300 $/mois | Lorepa.ca</title>
        <meta
          name="description"
          content="Mets ta remorque inutilisée en location sur Lorepa.ca. Gagne jusqu'à 300 $/mois. Inscription gratuite, tu gardes le contrôle, assurance incluse."
        />
        <link rel="canonical" href="https://lorepa.ca/proprietaire" />
      </Helmet>
      <main>
        <HeroSection />
        <RevenueCalculator />
        <BenefitsSection />
        <FinalCTA />
      </main>
    </div>
  );
};

export default OwnerLandingPage;
