import { BikeGallery } from '../components/BikeGallery';

interface BikesPageProps {
  t: any;
}

export function BikesPage({ t }: BikesPageProps) {
  return (
    <div className="pt-20">
      <BikeGallery t={t} />
    </div>
  );
}
