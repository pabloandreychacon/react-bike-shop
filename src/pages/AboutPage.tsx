import { About } from '../components/About';

interface AboutPageProps {
  t: any;
}

export function AboutPage({ t }: AboutPageProps) {
  return (
    <div className="pt-20">
      <About t={t} />
    </div>
  );
}
