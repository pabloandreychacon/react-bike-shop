import React from 'react';
import { Hero } from '../components/Hero';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomeProps {
  t: any;
}

export function Home({ t }: HomeProps) {
  return (
    <div>
      <Hero t={t} />

      {/* Featured Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">{t.bikes.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.bikes.subtitle}</p>
          </div>

          <div className="text-center mt-8">
            <div className="flex flex-col gap-4 items-center">
              <Link
                to="/bikes"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.hero.cta}
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.hero.servicesCta}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
