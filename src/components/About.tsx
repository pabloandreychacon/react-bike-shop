import { Award, Users, Wrench } from 'lucide-react';

interface AboutProps {
  t: any;
}

export function About({ t }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">{t.about.title}</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            {t.about.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="mb-2">{t.about.features.quality.title}</h3>
            <p className="text-gray-600">
              {t.about.features.quality.description}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="mb-2">{t.about.features.team.title}</h3>
            <p className="text-gray-600">
              {t.about.features.team.description}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="mb-2">{t.about.features.service.title}</h3>
            <p className="text-gray-600">
              {t.about.features.service.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
