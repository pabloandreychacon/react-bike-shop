import { BikeGallery } from '../components/BikeGallery';
import { Language } from '../utils/i18n';

interface BikesPageProps {
  t: any;
  language?: Language;
}

export function BikesPage({ t, language = 'en' }: BikesPageProps) {
  return (
    <div>
      <BikeGallery t={t} language={language} />
    </div>
  );
}
