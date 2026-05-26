import { Bike } from '../data/bikes';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MediaCarousel } from './MediaCarousel';

interface BikeCardProps {
  bike: Bike;
  bikesData: any;
}

export function BikeCard({ bike, bikesData }: BikeCardProps) {
  const items = useMemo(() => {
    const mediaList: { url: string; isVideo?: boolean }[] = [];
    if (bike.mediaItems) {
      mediaList.push(...bike.mediaItems);
    } else {
      try {
        const imageField = bike.image;
        if (imageField) {
          if (imageField.startsWith('[')) {
            const parsed = JSON.parse(imageField);
            if (Array.isArray(parsed)) {
              parsed.filter(Boolean).forEach((url: string) => mediaList.push({ url }));
            }
          } else {
            mediaList.push({ url: imageField });
          }
        }
      } catch {
        if (bike.image) mediaList.push({ url: bike.image });
      }
    }
    return mediaList;
  }, [bike.image, bike.mediaItems]);

  return (
    <Link
      to={`/product/${bike.id}`}
      className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="aspect-4/3 overflow-hidden relative">
        <MediaCarousel items={items} className="w-full h-full" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1 text-lg font-bold">{bike.name}</h3>
          <span className="text-blue-600 font-semibold text-lg">{bike.currency || '$'}{bike.price}</span>
        </div>
        <p className="text-gray-600 mb-2">{bike.type}</p>
        <p className="text-gray-700 mb-4">{bike.description}</p>
      </div>
    </Link>
  );
}
