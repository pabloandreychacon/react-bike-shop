import { BikeCard } from './BikeCard';
import { Bike } from '../utils/supabase/client';

interface BikeGalleryProps {
  t: any;
}

export function BikeGallery({ t }: BikeGalleryProps) {
  const bikes: Bike[] = [
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
  ];

  return (
    <section id="bikes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">{t.bikes.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.bikes.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
