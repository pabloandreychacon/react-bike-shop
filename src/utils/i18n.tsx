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
    bikes: {
      title: 'Our Collection',
      subtitle: 'Discover our carefully curated selection of bicycles',
      viewDetails: 'View Details',
      noData: 'No bikes available at the moment.',
      loading: 'Loading bikes...',
    },
    about: {
      title: 'About Our Store',
      description: 'We are a passionate team of cycling enthusiasts dedicated to providing the best bikes and service to our local community. With over 15 years of experience, we help riders of all levels find their perfect match.',
    },
    contact: {
      title: 'Visit Us',
      address: '123 Bike Street, Cycle City',
      phone: 'Phone: (555) 123-4567',
      email: 'Email: info@localcycles.com',
      hours: 'Hours: Mon-Sat 9AM-6PM',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Professional bike repair and maintenance services',
      basicRepair: {
        title: 'Basic Repair',
        description: 'Flat tire fixes, brake adjustments, and minor tune-ups',
        price: '$25-50',
      },
      tuneUp: {
        title: 'Full Tune-Up',
        description: 'Complete bike inspection, cleaning, and adjustment of all components',
        price: '$75-100',
      },
      overhaul: {
        title: 'Complete Overhaul',
        description: 'Full disassembly, cleaning, and rebuilding of your bicycle',
        price: '$150-250',
      },
      warranty: {
        title: 'Warranty Service',
        description: 'Free repairs and adjustments for bikes purchased from our shop',
        price: 'Free',
      },
    },
    footer: {
      rights: 'All rights reserved.',
      tagline: 'Your trusted local bicycle shop',
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
    bikes: {
      title: 'Nuestra Colección',
      subtitle: 'Descubre nuestra selección cuidadosamente curada de bicicletas',
      viewDetails: 'Ver Detalles',
      noData: 'No hay bicicletas disponibles en este momento.',
      loading: 'Cargando bicicletas...',
    },
    about: {
      title: 'Sobre Nuestra Tienda',
      description: 'Somos un equipo apasionado de entusiastas del ciclismo dedicados a proporcionar las mejores bicicletas y servicio a nuestra comunidad local. Con más de 15 años de experiencia, ayudamos a ciclistas de todos los niveles a encontrar su pareja perfecta.',
    },
    contact: {
      title: 'Visítanos',
      address: 'Calle Bicicleta 123, Ciudad Ciclista',
      phone: 'Teléfono: (555) 123-4567',
      email: 'Correo: info@localcycles.com',
      hours: 'Horario: Lun-Sáb 9AM-6PM',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Servicios profesionales de reparación y mantenimiento de bicicletas',
      basicRepair: {
        title: 'Reparación Básica',
        description: 'Reparación de llantas, ajuste de frenos y afinaciones menores',
        price: '$25-50',
      },
      tuneUp: {
        title: 'Afinación Completa',
        description: 'Inspección completa, limpieza y ajuste de todos los componentes',
        price: '$75-100',
      },
      overhaul: {
        title: 'Revisión Completa',
        description: 'Desmontaje completo, limpieza y reconstrucción de tu bicicleta',
        price: '$150-250',
      },
      warranty: {
        title: 'Servicio de Garantía',
        description: 'Reparaciones y ajustes gratuitos para bicicletas compradas en nuestra tienda',
        price: 'Gratis',
      },
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      tagline: 'Tu tienda local de bicicletas de confianza',
    },
  },
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
