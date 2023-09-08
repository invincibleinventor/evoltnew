import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';


export const Head = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <head>
      <meta charSet="utf-8" />

      <title>{head.title ? `${head.title} - Evolt` : `Evolt`}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={loc.url.href} />
      <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
    <script src="https://code.iconify.design/2/2.2.1/iconify.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

     

     
    </head>
  );
});