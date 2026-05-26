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
  isVideo?: boolean;
  mediaItems?: { url: string; isVideo: boolean }[];
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

    const products = data || [];
    const ids = products.map(p => p.Id).filter(Boolean);

    let mediaMap: Record<number, { url: string; isVideo: boolean }[]> = {};
    if (ids.length > 0) {
      const { data: media } = await supabase
        .from('ProductMedia')
        .select('ProductId, MediaUrl, isVideo')
        .in('ProductId', ids)
        .eq('IdBusiness', settings.id)
        .order('DisplayOrder', { ascending: true });

      (media || []).forEach((m: any) => {
        if (!mediaMap[m.ProductId]) mediaMap[m.ProductId] = [];
        mediaMap[m.ProductId].push({ url: m.MediaUrl, isVideo: m.isVideo === true || m.isVideo === 'true' });
      });
    }

    return products.map(product => {
      const items = mediaMap[product.Id] || [];
      const urls = items.map(i => i.url);
      const imageStr = urls.length > 1 ? JSON.stringify(urls) : (urls[0] || product.ImageUrl || '');
      return {
        id: product.Id?.toString() || '',
        title: parseBilingualText(product.Name || '', language),
        description: parseBilingualText(product.Description || '', language),
        price: product.Price ? `${settings.currencyCode || '$'}${product.Price}` : 'Free',
        image: imageStr || undefined,
        isVideo: items[0]?.isVideo || /\.mp4$/i.test(product.ImageUrl || ''),
        mediaItems: items.length > 0 ? items : undefined
      };
    }) || [];
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