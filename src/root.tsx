import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import { Head } from './components/head/head';
import styles from './modern.css'
export default component$(() => {
useStyles$(styles)
  return (
    
    <QwikCityProvider>
      <Head />
      <body lang="en" class="relative w-screen h-screen">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
