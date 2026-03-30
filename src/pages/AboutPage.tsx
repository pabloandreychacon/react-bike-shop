import { About } from '../components/About';

interface AboutPageProps {
  t: any;
}

export function AboutPage({ t }: AboutPageProps) {
  return (
    <div>
      <About t={t} />
    </div>
  );
}
