import { Wrench, Settings, Zap, Shield } from 'lucide-react';
import { services, getServicesFromSupabase, Service } from '../data/services';
import { Language } from '../utils/i18n';
import { useEffect, useState } from 'react';

interface ServicesPageProps {
  t: any;
  language?: Language;
}

export function ServicesPage({ t, language = 'en' }: ServicesPageProps) {
  const serviceData = services[language];
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
      const data = await getServicesFromSupabase(language);
      setServicesList(data.length > 0 ? data : defaultServices);
      setLoading(false);
    };
    fetchServices();
  }, [serviceData, language]);

  return (
    <div className="pt-20">
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
                const icons = [<Wrench key="wrench" className="w-12 h-12 text-blue-600" />, <Settings key="settings" className="w-12 h-12 text-blue-600" />, <Zap key="zap" className="w-12 h-12 text-blue-600" />, <Shield key="shield" className="w-12 h-12 text-blue-600" />];
                return (
                  <div key={service.id || `service-${index}`} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
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