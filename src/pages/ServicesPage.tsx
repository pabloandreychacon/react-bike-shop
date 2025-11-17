import { Wrench, Settings, Zap, Shield } from 'lucide-react';

interface ServicesPageProps {
  t: any;
}

export function ServicesPage({ t }: ServicesPageProps) {
  const services = [
    {
      icon: <Wrench className="w-12 h-12 text-blue-600" />,
      title: t.services.basicRepair.title,
      description: t.services.basicRepair.description,
      price: t.services.basicRepair.price,
    },
    {
      icon: <Settings className="w-12 h-12 text-blue-600" />,
      title: t.services.tuneUp.title,
      description: t.services.tuneUp.description,
      price: t.services.tuneUp.price,
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      title: t.services.overhaul.title,
      description: t.services.overhaul.description,
      price: t.services.overhaul.price,
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: t.services.warranty.title,
      description: t.services.warranty.description,
      price: t.services.warranty.price,
    },
  ];

  return (
    <div className="pt-20">
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4">{t.services.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}