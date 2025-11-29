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
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BikeIcon className="w-8 h-8 text-blue-600" />
          <span className="font-semibold text-xl">{settings?.name || 'Ciclo Renacer'}</span>
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
          <li>
            <Link
              to="/admin"
              className={`hover:text-blue-600 transition-colors ${isActive('/admin') ? 'text-blue-600' : ''}`}
            >
              Admin
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'ES' : 'EN'}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <ul className="flex flex-col py-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${isActive('/') ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  to="/bikes"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${isActive('/bikes') ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  {t.nav.bikes}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${isActive('/services') ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${isActive('/about') ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${isActive('/contact') ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${isActive('/admin') ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}