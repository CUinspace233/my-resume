import { FC } from 'react';

const Experience: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-4">Experience</h2>
      <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Full Stack Developer Intern – Graviti</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Built and optimized core features for internal tools using modern frontend stacks.</li>
          <li>Participated in code reviews and implemented performance improvements.</li>
        </ul>
      </div>
    </section>
  );
};

export default Experience; 