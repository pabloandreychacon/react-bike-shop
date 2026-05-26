import { useState, useEffect, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaItem {
  url: string;
  isVideo?: boolean;
}

interface MediaCarouselProps {
  items: MediaItem[];
  className?: string;
}

export function MediaCarousel({ items, className = '' }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prev = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const next = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (items.length === 0) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-400">Sin imagen</span></div>;
  }

  const current = items[currentIndex];
  const isVideo = /\.mp4(\?|$)/i.test(current.url) || /\.(webm|mov|avi|mkv)(\?|$)/i.test(current.url) || current.isVideo === true;

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      {isVideo ? (
        <video
          src={current.url}
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
        />
      ) : (
        <img
          src={current.url}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {items.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
