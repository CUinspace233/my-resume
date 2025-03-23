import { FC } from 'react';

interface ExperienceItem {
  company: string;
  position: string;
  achievements: string[];
}

const experienceData: ExperienceItem[] = [
  {
    company: 'Graviti',
    position: 'Full Stack Developer Intern',
    achievements: [
      'Built and optimized core features for internal tools using modern frontend stacks.',
      'Participated in code reviews and implemented performance improvements.'
    ]
  }
];

const Experience: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-2">
      <h2 className="text-xl font-bold">Experience</h2>
      {experienceData.map((item, index) => (
        <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{item.position} – {item.company}</h3>
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

export default Experience; 