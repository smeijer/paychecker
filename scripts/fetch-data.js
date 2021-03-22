import fs from 'fs';
import { gql, request } from 'graphql-request';

import { COUNTRIES } from '../data/constants.js';

const ranges = [
  'range_less_than_1',
  'range_1_2',
  'range_2_5',
  'range_5_10',
  'range_10_20',
  'range_more_than_20',
];

const query = gql`
    query yearlySalaryQuery($country: CountryID, $year: Int) {
        ${ranges.map(
          (range) => `${range}: survey(survey: state_of_js) {
    demographics {
      yearly_salary(filters: {
        country: { eq: $country },
        years_of_experience: { eq: ${range} }
      }) {
        year(year: $year) {
          year
          total
          completion {
            count
          }
          buckets {
            id
            count
          }
        }
      }
    }
  }`,
        )}
    }
`;

const experienceRanges = [
  'range_less_than_1',
  'range_1_2',
  'range_2_5',
  'range_5_10',
  'range_10_20',
  'range_more_than_20',
];

const salaryRanges = [
  'range_work_for_free',
  'range_0_10',
  'range_10_30',
  'range_30_50',
  'range_50_100',
  'range_100_200',
  'range_more_than_200',
];

function parse(input, other = {}) {
  const out = [];

  for (const years of experienceRanges) {
    const { year } = input[years].demographics.yearly_salary;
    const idx = {};

    const buckets = year?.buckets || [];
    for (const bucket of buckets) {
      idx[bucket.id] = bucket.count;
    }

    out.push(salaryRanges.map((bucket) => idx[bucket] || 0));
  }

  return out;
}

const averageSalaryRanges = [0, 5, 15, 40, 75, 150, 200];
const sum = (set) => set.reduce((s, n) => s + n, 0);

const allData = JSON.parse(fs.readFileSync('./data/data.json'));

async function main() {
  for (let i = 0; i < COUNTRIES.length; i++) {
    const country = COUNTRIES[i];

    if (allData[country]) {
      process.stdout.write(
        `fetching: ${i}/${COUNTRIES.length}; ${country}   - skipped`,
      );
      continue;
    }

    const variables = {
      country,
      year: 2020,
    };

    process.stdout.write(`fetching: ${i}/${COUNTRIES.length}; ${country}`);
    try {
      const data = await request(
        'https://api.stateofjs.com/graphql',
        query,
        variables,
      );
      // Experience[Salary[]]
      const datasets = parse(data, variables);

      // const count = sum(datasets.flat())
      // const average = sum(datasets.map((set, idx) => sum(set) * averageSalaryRanges[idx])) / count;

      allData[variables.country] = datasets;
      fs.writeFileSync('./data/data.json', JSON.stringify(allData));
      process.stdout.write(`\n`);
    } catch (e) {
      process.stdout.write(`   - failed\n`);
    }

    await new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

main();
