import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSettings, BusinessSettings } from '../utils/settings';

interface ContactProps {
  t: any;
}

export function Contact({ t }: ContactProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">{t.contact.title}</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1">{t.contact.addressLabel}</h3>
                    <p className="text-gray-600">{settings?.address || t.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1">{t.contact.phoneLabel}</h3>
                    <p className="text-gray-600">{settings?.phone || t.contact.phone.replace('Phone: ', '').replace('Teléfono: ', '')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1">{t.contact.emailLabel}</h3>
                    <p className="text-gray-600">{settings?.email || t.contact.email.replace('Email: ', '').replace('Correo: ', '')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1">{t.contact.hoursLabel}</h3>
                    <p className="text-gray-600">{settings?.hours || t.contact.hours.replace('Hours: ', '').replace('Horario: ', '')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-full w-full bg-gray-200 rounded-lg">
                <iframe
                  src={settings ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d766.125421148198!2d${settings.longitude}!3d${settings.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2scr!4v1763913695694!5m2!1ses!2scr` : "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d528.5131862478289!2d-84.09626289048713!3d10.029769425030603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses-419!2scr!4v1759266248821!5m2!1ses-419!2scr"}
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="mt-4">
                  <a
                    href={settings ? `https://www.google.com/maps/place/${settings.latitude},${settings.longitude}` : "https://www.google.com/maps"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
