import { FC } from 'react';

const Leadership: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-4">Leadership & Activities</h2>
      <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">IT Subcommittee Member – UNSW Artificial Intelligence Society (AISoc)</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Supported internal tool development and helped organize technical events and workshops.</li>
        </ul>
      </div>
    </section>
  );
};

export default Leadership; 