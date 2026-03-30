import { supabase } from '../lib/supabase';
import { getSettings } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';
import { Language } from '../utils/i18n';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  image?: string;
}

export async function getServicesFromSupabase(language: Language = 'en'): Promise<Service[]> {
  try {
    const settings = await getSettings();
    
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('BusinessEmail', settings.email)
      .eq('IsService', true)
      .eq('Active', true);

    if (error) {
      console.error('Error fetching services from Supabase:', error);
      return [];
    }

    return data?.map(product => ({
      id: product.Id?.toString() || '',
      title: parseBilingualText(product.Name || '', language),
      description: parseBilingualText(product.Description || '', language),
      price: product.Price ? `${settings.currencyCode || '$'}${product.Price}` : 'Free',
      image: product.ImageUrl || undefined
    })) || [];
  } catch (err) {
    console.error('Unexpected error fetching services:', err);
    return [];
  }
}

export const services = {
  en: {
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
  es: {
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
};