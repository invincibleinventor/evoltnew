import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (

<div class="flex flex-grow px-5 py-4 md:py-6 md:px-8 border-l border-l-neutral-800 md:border-none">
  <h1 class="text-[21px]  md:text-[21.75px] lg:text-[21.75px] font-semibold font-inter text-neutral-300">Profile</h1>
</div>
  );
});

export const head: DocumentHead = {
  title: 'Settings',
};