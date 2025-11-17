import { Bike } from '../utils/supabase/client';

interface BikeCardProps {
  bike: Bike;
  t: any;
}

export function BikeCard({ bike, t }: BikeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1">{bike.name}</h3>
          <span className="text-blue-600 font-semibold">${bike.price}</span>
        </div>
        <p className="text-gray-600 mb-2">{bike.type}</p>
        <p className="text-gray-700 mb-4">{bike.description}</p>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t.bikes.viewDetails}
        </button>
      </div>
    </div>
  );
}
