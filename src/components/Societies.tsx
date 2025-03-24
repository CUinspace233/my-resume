import { FC } from 'react';
import { useTranslations } from 'next-intl';

interface SocietiesItem {
  organization: string;
  position: string;
  achievements: string[];
}

const Societies: FC = () => {
  const t = useTranslations('sections.societies');
  const societiesData: SocietiesItem[] = t.raw('societiesData') as SocietiesItem[];

  return (
    <section className="w-full max-w-3xl mx-auto mb-2">
      <h2 className="text-xl font-bold mb-2">Societies & Activities</h2>
      {societiesData.map((item, index) => (
        <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {item.position} – {item.organization}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {item.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Societies;
