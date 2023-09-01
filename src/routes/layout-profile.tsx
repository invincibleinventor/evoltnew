// @ts-ignore

import { component$, Slot,$, useVisibleTask$, useStore, useSignal} from '@builder.io/qwik';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { Sidebar } from '~/components/sidebar/sidebar';
import  StoriesView  from '~/components/stories/stories'
import { supabase } from '~/services/supabase';
export default component$(async () => {

 
  return (
    <div class="bgcol ">
      <Header />
      
      <main class="flex flex-row md:flex-row w-screen flex-grow overflow-hidden ">
      
      <Menu />
      <div class="w-screen flex flex-col">        
     <Slot /></div>


      </main>

    </div>
  );
  }

);
