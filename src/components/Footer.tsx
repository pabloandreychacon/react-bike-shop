import { Bike, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSettings, BusinessSettings } from '../utils/settings';

interface FooterProps {
  t: any;
}

export function Footer({ t }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bike className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-xl">{settings?.name || 'Ciclo Renacer'}</span>
            </div>
            <p className="text-gray-400">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/bikes" className="hover:text-white transition-colors">{t.nav.bikes}</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">{t.nav.services}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">{t.footer.followUs}</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {currentYear} {settings?.name || 'Ciclo Renacer'}. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}