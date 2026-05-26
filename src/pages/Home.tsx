import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { BikeGallery } from '../components/BikeGallery';
import { Wrench, Settings, Zap, Shield, Star } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '../data/testimonials';
import { services, getServicesFromSupabase, Service } from '../data/services';
import { SEO, LocalBusinessSchema } from '../components/SEO';
import { MediaCarousel } from '../components/MediaCarousel';

interface HomeProps {
  t: any;
  language?: 'en' | 'es';
}

export function Home({ t, language = 'en' }: HomeProps) {
  const testimonialsData = testimonials[language];
  const servicesData = services[language];
  const [servicesList, setServicesList] = useState<Service[]>([]);

  const getFirstImage = (urlStr?: string) => {
    if (!urlStr) return null;
    try {
      if (urlStr.startsWith('[')) {
        const parsed = JSON.parse(urlStr);
        return parsed[0] || null;
      }
      return urlStr || null;
    } catch {
      return urlStr;
    }
  };

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
      <SEO
        title={t.hero?.title || 'Premium Bikes & Professional Services'}
        description={t.hero?.subtitle || 'Quality bicycles for road, mountain, and city riding with expert repair services.'}
      />
      <LocalBusinessSchema />
      <Hero t={t} language={language} />

      <BikeGallery t={t} language={language} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">{servicesData.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{servicesData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesList.map((service, index) => {
              const icons = [
                <Wrench key="wrench" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />,
                <Settings key="settings" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />,
                <Zap key="zap" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />,
                <Shield key="shield" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
              ];

              return (
                <Link
                  to={`/product/${service.id}`}
                  key={service.id || `service-${index}`}
                  className="block bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-start gap-4 lg:gap-8">
                    <div className="w-full lg:w-56 flex-shrink-0">
                      {service.mediaItems ? (
                        <MediaCarousel items={service.mediaItems} className="w-full h-48 md:h-56 rounded-xl shadow-sm ring-1 ring-gray-100" />
                      ) : (() => {
                        const img = getFirstImage(service.image) as string | undefined;
                        if (!img) return <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">{icons[index % icons.length]}</div>;
                        return /\.mp4(\?|$)/i.test(img) || /\.(webm|mov|avi|mkv)(\?|$)/i.test(img) || service.isVideo ? (
                          <video
                            src={img}
                            className="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover shadow-sm ring-1 ring-gray-100"
                            muted
                            autoPlay
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={img}
                            alt={service.title}
                            className="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover shadow-sm ring-1 ring-gray-100"
                          />
                        );
                      })()}
                    </div>
                    <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                    </div>
                  </div>
                </Link>
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
