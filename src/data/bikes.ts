import { supabase } from '../lib/supabase';
import { getSettings } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';
import { Language } from '../utils/i18n';

export interface Bike {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  image: string;
  currency?: string;
  isVideo?: boolean;
  mediaItems?: { url: string; isVideo: boolean }[];
}

export async function getBikesFromSupabase(language: Language = 'en'): Promise<Bike[]> {
  try {
    const settings = await getSettings();
    
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('BusinessEmail', settings.email)
      .eq('IsService', false)
      .eq('Active', true);

    if (error) {
      console.error('Error fetching bikes from Supabase:', error);
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
      const allVideos = items.filter(i => i.isVideo).map(i => i.url);
      return {
        id: product.Id?.toString() || '',
        name: parseBilingualText(product.Name || '', language),
        type: product.Category || '',
        price: product.Price || 0,
        description: parseBilingualText(product.Description || '', language),
        image: imageStr,
        currency: settings.currencyCode || '$',
        mediaItems: items.length > 0 ? items : undefined
      };
    }) || [];
  } catch (err) {
    console.error('Unexpected error fetching bikes:', err);
    return [];
  }
}

export const bikes = {
  en: {
    title: 'Our Collection',
    subtitle: 'Discover our carefully curated selection of bicycles',
    viewDetails: 'View Details',
    noData: 'No bikes available at the moment.',
    loading: 'Loading bikes...',
    list: [
      {
        id: '1',
        name: 'Mountain Pro X1',
        type: 'Mountain Bike',
        price: 1299,
        description: 'Professional mountain bike with full suspension and premium components.',
        image: 'https://images.unsplash.com/photo-1604677657548-4ced0c4f40c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjB0cmFpbHxlbnwxfHx8fDE3NjMzMTYzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '2',
        name: 'City Cruiser 500',
        type: 'City Bike',
        price: 699,
        description: 'Comfortable city bike perfect for urban commuting and leisure rides.',
        image: 'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYmljeWNsZSUyMHNob3B8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '3',
        name: 'Road Racer Elite',
        type: 'Road Bike',
        price: 1899,
        description: 'Lightweight road bike designed for speed and long-distance cycling.',
        image: 'https://images.unsplash.com/photo-1681295691087-77bdf1d59f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcm9hZCUyMGJpa2V8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '4',
        name: 'Hybrid Explorer',
        type: 'Hybrid Bike',
        price: 899,
        description: 'Versatile hybrid bike for both city streets and light trails.',
        image: 'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYmljeWNsZSUyMHNob3B8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ]
  },
  es: {
    title: 'Nuestra Colección',
    subtitle: 'Descubre nuestra selección cuidadosamente curada de bicicletas',
    viewDetails: 'Ver Detalles',
    noData: 'No hay bicicletas disponibles en este momento.',
    loading: 'Cargando bicicletas...',
    list: [
      {
        id: '1',
        name: 'Mountain Pro X1',
        type: 'Bicicleta de Montaña',
        price: 1299,
        description: 'Bicicleta de montaña profesional con suspensión completa y componentes premium.',
        image: 'https://images.unsplash.com/photo-1604677657548-4ced0c4f40c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjB0cmFpbHxlbnwxfHx8fDE3NjMzMTYzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '2',
        name: 'City Cruiser 500',
        type: 'Bicicleta Urbana',
        price: 699,
        description: 'Bicicleta urbana cómoda perfecta para desplazamientos urbanos y paseos de ocio.',
        image: 'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYmljeWNsZSUyMHNob3B8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '3',
        name: 'Road Racer Elite',
        type: 'Bicicleta de Carretera',
        price: 1899,
        description: 'Bicicleta de carretera ligera diseñada para velocidad y ciclismo de larga distancia.',
        image: 'https://images.unsplash.com/photo-1681295691087-77bdf1d59f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcm9hZCUyMGJpa2V8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '4',
        name: 'Hybrid Explorer',
        type: 'Bicicleta Híbrida',
        price: 899,
        description: 'Bicicleta híbrida versátil para calles de la ciudad y senderos ligeros.',
        image: 'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYmljeWNsZSUyMHNob3B8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ]
  }
};