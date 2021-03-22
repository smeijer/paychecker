import lookup from 'country-code-lookup';
import Head from 'next/head';
import React from 'react';

import { absoluteUrl } from '../components/absolute-url';
import Map from '../components/map';
import SocialHead from '../components/social-head';
import data from '../data/data.json';
import { useChart } from '../hooks/useChart';
import { HEATMAP } from './index';

export const getStaticPaths = async () => {
  const paths = Object.keys(data)
    .map((x) => x.toLowerCase())
    .map((path) => ({
      params: {
        slug: [lookup.byIso(path).iso2.toLowerCase()],
      },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const cc = params.slug[0].toUpperCase();

  const country = lookup.byIso(cc);

  if (!data[country.iso3]) {
    return {
      notFound: true,
    };
  }

  const labels = salaryRanges;

  const datasets = data[country.iso3].map((set, idx) => ({
    label: experienceRanges[idx],
    data: data[country.iso3][idx],
    backgroundColor: chartColors[idx],
    borderColor: chartColors[idx],
    color: 'rgb(255, 255, 255)',
    opacity: 1,
    borderWidth: 1,
  }));

  const total = datasets
    .flatMap((x) => x.data)
    .reduce((sum, next) => sum + next, 0);

  return {
    props: {
      country,
      labels,
      datasets,
      total,
    },
  };
};

const experienceRanges = ['0-1y', '1-2y', '2-5y', '5-10y', '10-20y', '>20y'];

const chartColors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
];

const salaryRanges = [
  '0',
  '0-10k',
  '10-30k',
  '30-50k',
  '50-100k',
  '100-200k',
  '>200k',
];

const averageSalaryRanges = [0, 5, 15, 40, 75, 150, 200];

function Chart({ datasets, labels }) {
  const [ref] = useChart({
    labels,
    datasets,
  });

  return <canvas ref={ref} width="160" height="90" />;
}

export default function Home({ country, labels, datasets, total }) {
  return (
    <>
      <SocialHead
        color="#D72323"
        name="paychecker"
        title={`PayChecker - Salary data for ${country.country}`}
        description={`Discover web-developer salaries in ${country.country}`}
        image={absoluteUrl('/social.png')}
        icons={[
          absoluteUrl('/logo-24.png'),
          absoluteUrl('/logo-48.png'),
          absoluteUrl('/logo-96.png'),
        ]}
      />
      <div className="w-screen h-screen relative bg-gray-800">
        <Head>
          <title>Average developer salary in {country.country}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="w-full h-full flex flex-col overflow-hidden min-h-0 mx-auto relative">
          <h1 className="flex-none pt-12 pb-2 text-4xl font-light text-white text-shadow-md text-center">
            Developer Salaries in {country.country}
          </h1>

          <div className="px-12 max-w-lg mx-auto flex items-stretch justify-stretch w-full h-1">
            {HEATMAP.map((x, idx) => (
              <div
                key={idx}
                className={`w-full h-full ${x.replace('text', 'bg')}`}
              />
            ))}
          </div>

          <div className="flex-auto pb-12 w-full overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 pb-4">
              <Map>
                {({ country: id, ...props }) => (
                  <g
                    {...props}
                    className={
                      id === country.iso2.toLowerCase()
                        ? 'text-blue-400'
                        : 'text-gray-700 opacity-75'
                    }
                  />
                )}
              </Map>
            </div>

            <div className="absolute opacity-50 bottom-0 z-20 px-12 max-w-lg mx-auto flex items-stretch justify-stretch w-full h-2" />

            <div className="h-72 w-full max-w-lg opacity-75 z-10">
              <Chart datasets={datasets} labels={labels} />
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center">
            this data is based on a total of {total} anonymous surveys
          </p>
        </main>
      </div>
    </>
  );
}
