import { BikeGallery } from '../components/BikeGallery';
import { SEO } from '../components/SEO';
import { Language } from '../utils/i18n';

interface BikesPageProps {
  t: any;
  language?: Language;
}

export function BikesPage({ t, language = 'en' }: BikesPageProps) {
  return (
    <div>
      <SEO
        title="Bikes"
        description="Browse our collection of premium bicycles for road, mountain, and city riding."
      />
      <BikeGallery t={t} language={language} />
    </div>
  );
}
