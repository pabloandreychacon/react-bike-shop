export type Language = 'en' | 'es';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      bikes: 'Bikes',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      title: 'Ride the Best Bikes',
      subtitle: 'Your local bicycle shop with premium quality bikes and expert service',
      cta: 'Explore Bikes',
      servicesCta: 'Explore Services',
    },

    about: {
      title: 'About Our Store',
      description: 'We are a passionate team of cycling enthusiasts dedicated to providing the best bikes and service to our local community. With over 15 years of experience, we help riders of all levels find their perfect match.',
      features: {
        quality: {
          title: 'Premium Quality',
          description: 'We stock only the finest bicycles from trusted manufacturers'
        },
        team: {
          title: 'Expert Team',
          description: 'Our knowledgeable staff helps you find the perfect bike'
        },
        service: {
          title: 'Full Service',
          description: 'Professional maintenance and repair services available'
        }
      }
    },
    contact: {
      title: 'Visit Us',
      address: '123 Bike Street, Cycle City',
      phone: 'Phone: (555) 123-4567',
      email: 'Email: info@localcycles.com',
      hours: 'Hours: Mon-Sat 9AM-6PM',
    },


    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Contact us today for a free consultation',
      button: 'Contact Us'
    },
    footer: {
      rights: 'All rights reserved.',
      tagline: 'Your trusted local bicycle shop',
      quickLinks: 'Quick Links',
      followUs: 'Follow Us',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      bikes: 'Bicicletas',
      services: 'Servicios',
      about: 'Nosotros',
      contact: 'Contacto',
    },
    hero: {
      title: 'Monta las Mejores Bicicletas',
      subtitle: 'Tu tienda local de bicicletas con calidad premium y servicio experto',
      cta: 'Explorar Bicicletas',
      servicesCta: 'Explorar Servicios',
    },

    about: {
      title: 'Sobre Nuestra Tienda',
      description: 'Somos un equipo apasionado de entusiastas del ciclismo dedicados a proporcionar las mejores bicicletas y servicio a nuestra comunidad local. Con más de 15 años de experiencia, ayudamos a ciclistas de todos los niveles a encontrar su pareja perfecta.',
      features: {
        quality: {
          title: 'Calidad Premium',
          description: 'Solo almacenamos las mejores bicicletas de fabricantes confiables'
        },
        team: {
          title: 'Equipo Experto',
          description: 'Nuestro personal conocedor te ayuda a encontrar la bicicleta perfecta'
        },
        service: {
          title: 'Servicio Completo',
          description: 'Servicios profesionales de mantenimiento y reparación disponibles'
        }
      }
    },
    contact: {
      title: 'Visítanos',
      address: 'Calle Bicicleta 123, Ciudad Ciclista',
      phone: 'Teléfono: (555) 123-4567',
      email: 'Correo: info@localcycles.com',
      hours: 'Horario: Lun-Sáb 9AM-6PM',
    },


    cta: {
      title: '¿Listo para Comenzar?',
      subtitle: 'Contáctanos hoy para una consulta gratuita',
      button: 'Contáctanos'
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      tagline: 'Tu tienda local de bicicletas de confianza',
      quickLinks: 'Enlaces Rápidos',
      followUs: 'Síguenos',
    },
  },
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
