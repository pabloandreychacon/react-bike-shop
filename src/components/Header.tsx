import { Languages, Bike as BikeIcon, Menu, X } from 'lucide-react';
import { Language } from '../utils/i18n';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSettings, BusinessSettings } from '../utils/settings';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export function Header({ language, setLanguage, t }: HeaderProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <BikeIcon className="w-8 h-8 text-blue-600" />
            <span className="sm:text-sm md:text-lg xl:text-xl font-bold text-gray-900">
              {settings?.name || 'Ciclo Renacer'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t.nav.home}
            </Link>
            <Link
              to="/bikes"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t.nav.bikes}
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t.nav.services}
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {t.nav.contact}
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="px-4 py-3 space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t.nav.home}
              </Link>
              <Link
                to="/bikes"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t.nav.bikes}
              </Link>
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t.nav.services}
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t.nav.about}
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {t.nav.contact}
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}