import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { BikeGallery } from '../components/BikeGallery';
import { Wrench, Settings, Zap, Shield, Star } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '../data/testimonials';
import { services, getServicesFromSupabase, Service } from '../data/services';

interface HomeProps {
  t: any;
  language?: 'en' | 'es';
}

export function Home({ t, language = 'en' }: HomeProps) {
  const testimonialsData = testimonials[language];
  const servicesData = services[language];
  const [servicesList, setServicesList] = useState<Service[]>([]);

  const defaultServices = [
    {
      id: '1',
      title: servicesData.basicRepair.title,
      description: servicesData.basicRepair.description,
      price: servicesData.basicRepair.price,
    },
    {
      id: '2',
      title: servicesData.tuneUp.title,
      description: servicesData.tuneUp.description,
      price: servicesData.tuneUp.price,
    },
    {
      id: '3',
      title: servicesData.overhaul.title,
      description: servicesData.overhaul.description,
      price: servicesData.overhaul.price,
    },
    {
      id: '4',
      title: servicesData.warranty.title,
      description: servicesData.warranty.description,
      price: servicesData.warranty.price,
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServicesFromSupabase(language);
      setServicesList(data.length > 0 ? data : defaultServices);
    };
    fetchServices();
  }, [servicesData, language]);

  return (
    <div>
      <Hero t={t} />

      <BikeGallery t={t} language={language} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">{servicesData.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{servicesData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesList.map((service, index) => {
              const icons = [<Wrench className="w-12 h-12 text-blue-600" />, <Settings className="w-12 h-12 text-blue-600" />, <Zap className="w-12 h-12 text-blue-600" />, <Shield className="w-12 h-12 text-blue-600" />];
              return (
                <div key={service.id} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {icons[index % icons.length]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{testimonialsData.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.clients.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-blue-100 text-lg mb-8">{t.cta.subtitle}</p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            {t.cta.button}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
