import 'tippy.js/dist/tippy.css';

import Tippy, { useSingleton } from '@tippyjs/react';
import lookup from 'country-code-lookup';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { absoluteUrl } from '../components/absolute-url';
import Map from '../components/map';
import SocialHead from '../components/social-head';
import data from '../data/data.json';

const averageSalaryRanges = [0, 5, 15, 40, 75, 150, 200];
const sum = (set) => set.reduce((s, n) => s + n, 0);

export const HEATMAP = [
  'text-blue-400',
  'text-blue-500',
  'text-green-500',
  'text-green-600',
  'text-yellow-400',
  'text-yellow-600',
  'text-orange-600',
  'text-orange-700',
  'text-red-600',
  'text-red-700',
];

export const getStaticProps = async ({ params }) => {
  const countries = {};
  let total = 0;

  const level = null;

  for (const country of Object.keys(data)) {
    const datasets =
      typeof level === 'number' ? [data[country][level]] : data[country];

    const count = sum(datasets.flat());

    // let average = sum(datasets.map((set, idx) => sum(set) * averageSalaryRanges[level ?? idx])) / count || 0;
    const result = { money: 0, surveys: 0 };
    for (const experienceGroup of datasets) {
      for (let i = 0; i < experienceGroup.length - 1; i++) {
        result.surveys += experienceGroup[i];
        result.money += experienceGroup[i] * averageSalaryRanges[i];
      }
    }

    const average = Math.floor(result.money / result.surveys || 0) * 1000;
    total += count;
    countries[lookup.byIso(country).iso2.toLowerCase()] = average;
  }

  // console.dir(countries, { depth: 2 });
  const values: number[] = Object.values(countries);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.floor(sum(values) / values.length);

  for (const country of Object.keys(countries)) {
    const avg = countries[country];

    const ratio = Math.min(
      Math.floor((1 / max) * countries[country] * 10),
      HEATMAP.length - 1,
    );

    countries[country] = {
      name: lookup.byIso(country).country,
      avg,
      ratio,
      color: avg === 0 ? 'text-gray-700' : HEATMAP[ratio], // color(heatMapColorforValue(ratio)).alpha(0.5).lighten(0).toString(),
    };
  }

  return {
    props: {
      countries,
      min,
      max,
      avg,
      total,
    },
  };
};

const number = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function Home({ countries, total }) {
  const [source, target] = useSingleton();

  return (
    <>
      <SocialHead
        color="#D72323"
        name="paychecker"
        title="PayChecker - Global Dev Salary Checker"
        description="Compare web-developer salaries across the planet."
        image={absoluteUrl('/social.png')}
        icons={[
          absoluteUrl('/logo-24.png'),
          absoluteUrl('/logo-48.png'),
          absoluteUrl('/logo-96.png'),
        ]}
      />
      <div className="w-screen h-screen relative bg-gray-800">
        <Head>
          <title>Average developer salary across the world</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Tippy singleton={source} delay={0} />

        <main className="w-full h-full flex flex-col overflow-hidden min-h-0 mx-auto relative">
          <h1 className="flex-none pt-12 pb-2 text-4xl font-light text-white text-shadow-md text-center">
            Global Developer Salaries
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
                {({ country, key, ...props }) => {
                  return countries[country]?.avg ? (
                    <Link key={key} href={`/${country}`}>
                      <a className="hover:opacity-75 opacity-100 group">
                        <Tippy
                          key={key}
                          content={
                            <>
                              {countries[country].name}:<br />{' '}
                              {number.format(countries[country].avg)}
                            </>
                          }
                          singleton={target}
                        >
                          <g
                            {...props}
                            fill={countries[country].color}
                            className={`group-hover:shadow-lg ${countries[country].color}`}
                          />
                        </Tippy>
                      </a>
                    </Link>
                  ) : (
                    <g key={key} {...props} className="text-gray-700" />
                  );
                }}
              </Map>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            data based on a total of {total} anonymous surveys
          </p>
        </main>
      </div>
    </>
  );
}
