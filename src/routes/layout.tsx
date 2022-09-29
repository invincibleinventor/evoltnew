import { component$, Slot } from '@builder.io/qwik';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { Sidebar } from '~/components/sidebar/sidebar';
import { Publish } from '~/components/publish/publish';
export default component$(() => {
  return (
    <div class="bg-neutral-900 w-screen h-screen flex flex-col">
      <Header />
      <main class="flex flex-row-reverse md:flex-row w-screen overflow-hidden ">
      
      <Menu />

      <Slot />
      <Sidebar />
      </main>
    </div>
  );
});
