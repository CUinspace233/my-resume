import { FC } from 'react';

const Education: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb2">
      <h2 className="text-xl font-bold">Education</h2>
      <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">University of New South Wales (UNSW), Sydney</h3>
          <span className="text-xs text-gray-600 dark:text-gray-400">Feb 2024 - Dec 2026</span>
        </div>
        <p className="text-sm mb-2">Bachelor of Computer Science</p>
        <p className="text-xs">
          <span className="font-medium">Relevant Coursework:</span> Web Front-End Programming, 
          Data Structures and Algorithms, Object-Oriented Programming, Software Engineering Fundamentals, 
          Computer Systems Fundamentals, Software Construction: Techniques and Tools
        </p>
      </div>
    </section>
  );
};

export default Education; 