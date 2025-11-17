import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  t: any;
}

export function Hero({ t }: HeroProps) {
  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

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