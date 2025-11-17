import { Contact } from '../components/Contact';

interface ContactPageProps {
  t: any;
}

export function ContactPage({ t }: ContactPageProps) {
  return (
    <div className="pt-20">
      <Contact t={t} />
    </div>
  );
}
