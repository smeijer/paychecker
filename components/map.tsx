import React from 'react';

import { countries } from './countries';

export default function Map({ children }) {
  //const render = typeof children === 'function' ? children : (props) => <path {...props}/>;
  const render =
    typeof children === 'function' ? children : (props) => <g {...props} />;

  return (
    <svg
      version="1.2"
      x="0px"
      y="0px"
      width="100%"
      height="100%"
      viewBox="9 3 940 530"
    >
      {countries.map((shape) =>
        render({
          children: shape.paths.map((path, idx) => (
            <path
              key={`${shape.id}.${idx}`}
              d={path}
              fill="currentColor"
              strokeWidth=".5"
            />
          )),
          country: shape.id,
          key: shape.id,
          id: shape.id,
        }),
      )}
    </svg>
  );
}

// <g key={shape.id} id={shape.id}>
//   {shape.paths.map((path, idx) =>
//     render({ key: `${shape.id}.${idx}`, country: shape.id, d: path, strokeWidth: .5 }),
//   )}
// </g>
