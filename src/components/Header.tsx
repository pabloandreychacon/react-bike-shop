import { Languages, Bike as BikeIcon } from 'lucide-react';
import { Language } from '../utils/i18n';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export function Header({ language, setLanguage, t }: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BikeIcon className="w-8 h-8 text-blue-600" />
          <span className="font-semibold text-xl">Ciclo Renacer</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              to="/"
              className={`hover:text-blue-600 transition-colors ${isActive('/') ? 'text-blue-600' : ''}`}
            >
              {t.nav.home}
            </Link>
          </li>
          <li>
            <Link
              to="/bikes"
              className={`hover:text-blue-600 transition-colors ${isActive('/bikes') ? 'text-blue-600' : ''}`}
            >
              {t.nav.bikes}
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`hover:text-blue-600 transition-colors ${isActive('/services') ? 'text-blue-600' : ''}`}
            >
              {t.nav.services}
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`hover:text-blue-600 transition-colors ${isActive('/about') ? 'text-blue-600' : ''}`}
            >
              {t.nav.about}
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`hover:text-blue-600 transition-colors ${isActive('/contact') ? 'text-blue-600' : ''}`}
            >
              {t.nav.contact}
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {language === 'en' ? 'ES' : 'EN'}
        </button>
      </nav>
    </header>
  );
}