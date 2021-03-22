import Head from 'next/head';

import { absoluteUrl } from './absolute-url';

interface SocialProps {
  color: string;
  keywords?: string[];
  name: string;
  title: string;
  description: string;
  image: string;
  icons: string[];
}

const extMimeMap = {
  png: 'image/png',
  jpg: 'image/jpg',
};

function SocialHead({
  color,
  keywords = [],
  name,
  title,
  description,
  image,
  icons = [],
}: SocialProps) {
  return (
    <Head>
      <title>{title}</title>

      <meta charSet="utf-8" />
      <meta name="msapplication-TileColor" content={color} />
      <meta name="theme-color" content={color} />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />

      <meta name="keywords" content={keywords.join(', ')} />

      {/*<!-- icons -->*/}
      {icons.map((href) => {
        const [ext, size] = href.split(/[\/\-.]/).reverse();
        return (
          <link
            key={href}
            rel="icon"
            type={extMimeMap[ext] || extMimeMap.png}
            sizes={`${size}x${size}`}
            href={href}
          />
        );
      })}

      {/*<!-- Schema.org -->*/}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />
      <meta property="image:alt" content={description} />

      {/*<!-- Facebook OpenGraph -->*/}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={absoluteUrl('/')} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={description} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="670" />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="en_US" />

      {/*<!-- Twitter OpenGraph -->*/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl('/')} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={description} />
    </Head>
  );
}
export default SocialHead;
