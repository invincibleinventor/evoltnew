import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (

<div class=" px-6 py-4 md:py-6 md:px-8">
  <h1 class="text-[21px]  md:text-[21.75px] lg:text-[21.75px] font-semibold font-inter text-neutral-300">Profile</h1>
</div>
  );
});

export const head: DocumentHead = {
  title: 'Settings',
};