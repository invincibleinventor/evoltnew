import { component$, Slot } from '@builder.io/qwik';

import  StoriesView  from '~/components/stories/stories'
import { Menu } from './menu';
export default component$(() => {
  return (
    <div class="bgcol">
      
      <main class="flex flex-row md:flex-row w-screen flex-grow overflow-hidden  ">
      
   <div class="h-[100%]">
<Menu />
</div>
    
<Slot />

      </main>
    </div>
  );
});
