import { FC } from 'react';

interface LeadershipItem {
  organization: string;
  position: string;
  achievements: string[];
}

const leadershipData: LeadershipItem[] = [
  {
    organization: 'UNSW Artificial Intelligence Society (AISoc)',
    position: 'IT Subcommittee Member',
    achievements: [
      'Supported internal tool development and helped organize technical events and workshops.'
    ]
  }
];

const Leadership: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-2">
      <h2 className="text-xl font-bold">Leadership & Activities</h2>
      {leadershipData.map((item, index) => (
        <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{item.position} – {item.organization}</h3>
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

export default Leadership; 