import { supabase } from '../lib/supabase';

export interface BusinessSettings {
  id: number;
  email: string;
  phone: string;
  address: string;
  name: string;
  latitude: number;
  longitude: number;
  onlinePassword: string;
  currencyCode: string;
}

export const defaultSettings: BusinessSettings = {
  id: 6,
  email: 'info@localcycles.com',
  phone: 'd(555) 123-4567',
  address: 'd123 Bike Street, Cycle City, Country',
  name: 'dRenacer Bike Shop',
  latitude: 10.007725,
  longitude: -84.099413,
  onlinePassword: 'd',
  currencyCode: '$'
};

export async function getSettings(): Promise<BusinessSettings> {
  try {
    const { data, error } = await supabase
      .from('Settings')
      .select('Email, Phone, Address, BusinessName, MapLocation, OnlinePassword, CurrencyCode')
      .eq('Id', defaultSettings.id)
      .single();

    if (error) {
      console.error('Supabase getSettings error:', error);
      return defaultSettings;
    }

    if (!data) return defaultSettings;

    let latitude = defaultSettings.latitude;
    let longitude = defaultSettings.longitude;

    if (data.MapLocation) {
      const coords = (data.MapLocation as string).split(',').map((c: string) => parseFloat(c.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        latitude = coords[0];
        longitude = coords[1];
      }
    }

    return {
      id: defaultSettings.id,
      email: (data.Email as string) ?? defaultSettings.email,
      phone: (data.Phone as string) ?? defaultSettings.phone,
      address: (data.Address as string) ?? defaultSettings.address,
      name: (data.BusinessName as string) ?? defaultSettings.name,
      latitude,
      longitude,
      onlinePassword: (data.OnlinePassword as string) ?? defaultSettings.onlinePassword,
      currencyCode: (data.CurrencyCode as string) ?? defaultSettings.currencyCode
    };
  } catch (err) {
    console.error('getSettings unexpected error', err);
    return defaultSettings;
  }
}
