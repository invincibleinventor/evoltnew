import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCity, RouterOutlet } from '@builder.io/qwik-city';
import { Head } from './components/head/head';
import styles from './modern.css'
export default component$(() => {
useStyles$(styles)
  return (
    
    <QwikCity>
      <Head />
      <body lang="en" class="relative w-screen h-screen">
        <RouterOutlet />
      </body>
    </QwikCity>
  );
});
