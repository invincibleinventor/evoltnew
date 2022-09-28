import { component$, Slot } from '@builder.io/qwik';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { Sidebar } from '~/components/sidebar/sidebar';
export default component$(() => {
  return (
    <div class="bgcol">
      <Header />
      
      <main class="flex flex-row-reverse md:flex-row w-screen flex-grow overflow-hidden ">
      
      <Menu />
      <Slot />
      <Sidebar />
      </main>
    </div>
  );
});
