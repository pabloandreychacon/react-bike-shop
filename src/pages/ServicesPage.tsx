import { Wrench, Settings, Zap, Shield } from 'lucide-react';
import { services, getServicesFromSupabase, Service } from '../data/services';
import { getSettings } from '../utils/settings';
import { Language } from '../utils/i18n';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ServicesPageProps {
  t: any;
  language?: Language;
}

export function ServicesPage({ t, language = 'en' }: ServicesPageProps) {
  const serviceData = services[language];
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
      title: serviceData.basicRepair.title,
      description: serviceData.basicRepair.description,
      price: serviceData.basicRepair.price,
    },
    {
      id: '2',
      title: serviceData.tuneUp.title,
      description: serviceData.tuneUp.description,
      price: serviceData.tuneUp.price,
    },
    {
      id: '3',
      title: serviceData.overhaul.title,
      description: serviceData.overhaul.description,
      price: serviceData.overhaul.price,
    },
    {
      id: '4',
      title: serviceData.warranty.title,
      description: serviceData.warranty.description,
      price: serviceData.warranty.price,
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const settings = await getSettings();
      const currency = settings.currencyCode || '$';
      
      const defaultServicesWithCurrency = defaultServices.map(s => ({
        ...s,
        price: s.price.replace('$', currency)
      }));

      const data = await getServicesFromSupabase(language);
      setServicesList(data.length > 0 ? data : defaultServicesWithCurrency);
      setLoading(false);
    };
    fetchServices();
  }, [serviceData, language]);

  return (
    <div>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4">{serviceData.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{serviceData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : servicesList.length > 0 ? (
              servicesList.map((service, index) => {
                const icons = [<Wrench key="wrench" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />, <Settings key="settings" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />, <Zap key="zap" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />, <Shield key="shield" className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />];
                return (
                  <Link
                    to={`/product/${service.id}`}
                    key={service.id || `service-${index}`}
                    className="block bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8">
                      <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                        {getFirstImage(service.image) ? (
                          <img
                            src={getFirstImage(service.image)}
                            alt={service.title}
                            className="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover shadow-sm ring-1 ring-gray-100"
                          />
                        ) : (
                          icons[index % icons.length]
                        )}
                      </div>
                      <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0">
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No services available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}