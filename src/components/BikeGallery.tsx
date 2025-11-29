import { BikeCard } from './BikeCard';
import { bikes, getBikesFromSupabase, Bike } from '../data/bikes';
import { Language } from '../utils/i18n';
import { useEffect, useState } from 'react';

interface BikeGalleryProps {
  t: any;
  language?: Language;
}

export function BikeGallery({ t, language = 'en' }: BikeGalleryProps) {
  const bikesData = bikes[language];
  const [bikesList, setBikesList] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      const data = await getBikesFromSupabase(language);
      setBikesList(data.length > 0 ? data : bikesData.list);
      setLoading(false);
    };
    fetchBikes();
  }, [bikesData.list, language]);

  return (
    <section id="bikes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">{bikesData.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{bikesData.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">{bikesData.loading}</p>
            </div>
          ) : bikesList.length > 0 ? (
            bikesList.map((bike, index) => (
              <BikeCard key={bike.id || `bike-${index}`} bike={bike} bikesData={bikesData} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">{bikesData.noData}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
