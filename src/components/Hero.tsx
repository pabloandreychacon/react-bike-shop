import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSettings } from '../utils/settings';
import { splitBilingualText } from '../utils/bilingual';
import { Language } from '../utils/i18n';

interface HeroProps {
  t: any;
  language?: Language;
}

interface OfferProduct {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  IsService: boolean;
  Active: boolean;
}

export function Hero({ t, language = 'en' }: HeroProps) {
  const [offers, setOffers] = useState<OfferProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currencyCode, setCurrencyCode] = useState('$');

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const settings = await getSettings();
        setCurrencyCode(settings.currencyCode || '$');
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('IdBusiness', settings.id)
          .eq('Active', true)
          .eq('IsOffer', true);

        if (error) throw error;
        setOffers(data || []);
      } catch (err) {
        console.error('Error fetching offers:', err);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current === offers.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentIndex((current) => (current === offers.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((current) => (current === 0 ? offers.length - 1 : current - 1));
  };

  const getFirstImage = (urlStr: string) => {
    if (!urlStr) return '/bike-shop-bg.jpg';
    try {
      if (urlStr.startsWith('[')) {
        const parsed = JSON.parse(urlStr);
        return parsed[0] || '/bike-shop-bg.jpg';
      }
      return urlStr;
    } catch {
      return urlStr;
    }
  };

  // If no offers, fallback to exactly what was there before
  if (offers.length === 0) {
    return (
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bike-shop-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'zoomIn 8s ease-in-out infinite alternate',
            transform: 'scale(1)',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="mb-6">{t.hero.title}</h1>
          <p className="mb-8 text-xl opacity-90">{t.hero.subtitle}</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/bikes"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t.hero.cta}
            </Link>
            <Link
              to="/services"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t.hero.servicesCta}
            </Link>
          </div>
        </div>

        <button
          onClick={scrollDown}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>
    );
  }

  const currentOffer = offers[currentIndex];
  const nameParts = splitBilingualText(currentOffer.Name || '');
  const descParts = splitBilingualText(currentOffer.Description || '');
  
  const title = nameParts[language] || nameParts.en || nameParts.es || currentOffer.Name;
  const description = descParts[language] || descParts.en || descParts.es || currentOffer.Description;
  
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {offers.map((offer, index) => {
        const isCurrent = index === currentIndex;
        const offerBgImage = getFirstImage(offer.ImageUrl);
        return (
          <div
            key={offer.Id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isCurrent ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url('${offerBgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
        );
      })}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-16 md:px-24 lg:px-32 pt-20 flex flex-col md:flex-row items-center justify-between">
        <div className="text-white max-w-2xl text-left">
          <span className="inline-block px-3 py-1 bg-yellow-500 text-black font-semibold text-sm rounded-full mb-4">
            {t.products?.offer || (language === 'es' ? 'Oferta Especial' : 'Special Offer')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md line-clamp-3">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-3xl font-bold text-white bg-black/30 backdrop-blur-md px-6 py-3 rounded-lg border border-white/20 shadow-xl">
              {currencyCode}{currentOffer.Price}
            </div>
            <Link
              to={`/product/${currentOffer.Id}`}
              className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1"
            >
              {t.hero.viewOffer || 'View Offer'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {offers.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}

      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce z-20"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}