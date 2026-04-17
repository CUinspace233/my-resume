import ContributionsChartClient from './ContributionsChartClient';

async function fetchContributionsCount(): Promise<number | null> {
  try {
    const res = await fetch('https://github.com/users/CUinspace233/contributions', {
      headers: {
        Accept: 'text/html',
        'X-Requested-With': 'XMLHttpRequest',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const matches = [...html.matchAll(/data-count="(\d+)"/g)];
    const total = matches.reduce((sum, m) => sum + parseInt(m[1], 10), 0);
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

export default async function ContributionsChart() {
  const count = await fetchContributionsCount();
  return <ContributionsChartClient contributionsCount={count} />;
}
