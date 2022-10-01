import { component$, Slot } from '@builder.io/qwik';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { Sidebar } from '~/components/sidebar/sidebar';
import  StoriesView  from '~/components/stories/stories'
export default component$(() => {
  return (
    <div class="bgcol">
      <Header />
      
      <main class="flex flex-row md:flex-row w-screen flex-grow overflow-hidden ">
      
      <Menu />
      <div class="w-screen">       	<div id="tags" class="flex flex-row w-[100%] p-5 space-x-4">
  <StoriesView onClick$={()=>{console.log('ok')}} poster="https://picsum.photos/100/200" name="John Doe" url="https://picsum.photos/300/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/300" name="Jack Steyn" url="https://picsum.photos/100/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/200" name="Amy Bruce" url="https://picsum.photos/200/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/100" name="Sino Wells" url="https://picsum.photos/300/300"></StoriesView>
  <StoriesView poster="https://picsum.photos/300/200" name="Bret Pope" url="https://picsum.photos/200/300"></StoriesView>
  <StoriesView poster="https://picsum.photos/400/300" name="Steve Chris" url="https://picsum.photos/100/300"></StoriesView>
 
 
</div></div>

<Slot />
      <Sidebar />
      </main>
    </div>
  );
});
