import { Bike } from '../data/bikes';
import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BikeCardProps {
  bike: Bike;
  bikesData: any;
}

export function BikeCard({ bike, bikesData }: BikeCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo<string[]>(() => {
    try {
      const imageField = bike.image;
      if (!imageField) return [];

      if (imageField.startsWith('[')) {
        const parsed = JSON.parse(imageField);
        return Array.isArray(parsed) ? (parsed as string[]).filter(Boolean) : [];
      }

      return [imageField];
    } catch {
      return bike.image ? [bike.image] : [];
    }
  }, [bike.image]);

  const [isHovered, setIsHovered] = useState(false);

  // If the bike changes, restart the carousel at the first image.
  useEffect(() => {
    setCurrentIndex(0);
  }, [bike.image]);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length, isHovered, bike.image]);

  const prevImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-4/3 overflow-hidden relative group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentIndex]}
              alt={`${bike.name} - Imagen ${currentIndex + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1 text-lg font-bold">{bike.name}</h3>
          <span className="text-blue-600 font-semibold text-lg">{bike.currency || '$'}{bike.price}</span>
        </div>
        <p className="text-gray-600 mb-2">{bike.type}</p>
        <p className="text-gray-700 mb-4">{bike.description}</p>

      </div>
    </div>
  );
}