import { orange } from 'twind/colors';

/** @type {import('twind').Configuration} */
export default {
  mode: 'silent',
  theme: {
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
      colors: {
        orange,
      },
    },
  },
};
