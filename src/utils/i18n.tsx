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
      viewOffer: 'View Offer',
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
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      hoursLabel: 'Hours',
      address: '123 Bike Street, Cycle City',
      phone: 'Phone: (555) 123-4567',
      email: 'Email: info@localcycles.com',
      hours: 'Hours: Mon-Sat 10AM-6PM',
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
    admin: {
      title: 'Admin Access',
      dashboard: 'Admin Dashboard',
      password: 'Password',
      passwordPlaceholder: 'Enter admin password',
      signIn: 'Sign In',
      authenticating: 'Authenticating...',
      invalidPassword: 'Invalid password',
      authFailed: 'Authentication failed',
      settings: 'Settings',
      products: 'Products',
    },
    products: {
      title: 'Products Management',
      addProduct: 'Add Product',
      name: 'Name',
      nameSpanish: 'Name (Spanish)',
      nameEnglish: 'Name (English)',
      description: 'Description',
      descriptionSpanish: 'Description (Spanish)',
      descriptionEnglish: 'Description (English)',
      price: 'Price',
      imageUrl: 'Image URL',
      isService: 'Is Service',
      isOffer: 'Is Offer',
      active: 'Active',
      service: 'Service',
      offer: 'Offer',
      product: 'Product',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this product?',
      noProducts: 'No products found. Click "Add Product" to create your first product.',
      loading: 'Loading products...',
    },
    settings: {
      title: 'Business Settings',
      businessName: 'Business Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      latitude: 'Latitude',
      longitude: 'Longitude',
      updatePassword: 'Update Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      newPasswordPlaceholder: 'Leave empty to keep current password',
      confirmPasswordPlaceholder: 'Confirm new password',
      passwordsNoMatch: 'Passwords do not match',
      settingsSaved: 'Settings saved successfully!',
      errorSaving: 'Error saving settings',
      saving: 'Saving...',
      saveSettings: 'Save Settings',
      loadingSettings: 'Loading settings...',
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
      viewOffer: 'Ver Oferta',
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
      addressLabel: 'Dirección',
      phoneLabel: 'Teléfono',
      emailLabel: 'Correo',
      hoursLabel: 'Horario',
      address: 'Calle Bicicleta 123, Ciudad Ciclista',
      phone: 'Teléfono: (555) 123-4567',
      email: 'Correo: info@localcycles.com',
      hours: 'Horario: Lun-Sáb 10AM-6PM',
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
    admin: {
      title: 'Acceso de Administrador',
      dashboard: 'Panel de Administración',
      password: 'Contraseña',
      passwordPlaceholder: 'Ingrese la contraseña de administrador',
      signIn: 'Iniciar Sesión',
      authenticating: 'Autenticando...',
      invalidPassword: 'Contraseña inválida',
      authFailed: 'Falló la autenticación',
      settings: 'Configuración',
      products: 'Productos',
    },
    products: {
      title: 'Gestión de Productos',
      addProduct: 'Agregar Producto',
      name: 'Nombre',
      nameSpanish: 'Nombre (Español)',
      nameEnglish: 'Nombre (Inglés)',
      description: 'Descripción',
      descriptionSpanish: 'Descripción (Español)',
      descriptionEnglish: 'Descripción (Inglés)',
      price: 'Precio',
      imageUrl: 'URL de Imagen',
      isService: 'Es Servicio',
      isOffer: 'Es Oferta',
      active: 'Activo',
      service: 'Servicio',
      offer: 'Oferta',
      product: 'Producto',
      inactive: 'Inactivo',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      confirmDelete: '¿Está seguro de que desea eliminar este producto?',
      noProducts: 'No se encontraron productos. Haga clic en "Agregar Producto" para crear su primer producto.',
      loading: 'Cargando productos...',
    },
    settings: {
      title: 'Configuración del Negocio',
      businessName: 'Nombre del Negocio',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      latitude: 'Latitud',
      longitude: 'Longitud',
      updatePassword: 'Actualizar Contraseña',
      newPassword: 'Nueva Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      newPasswordPlaceholder: 'Dejar vacío para mantener la contraseña actual',
      confirmPasswordPlaceholder: 'Confirmar nueva contraseña',
      passwordsNoMatch: 'Las contraseñas no coinciden',
      settingsSaved: '¡Configuración guardada exitosamente!',
      errorSaving: 'Error al guardar la configuración',
      saving: 'Guardando...',
      saveSettings: 'Guardar Configuración',
      loadingSettings: 'Cargando configuración...',
    },
  },
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
