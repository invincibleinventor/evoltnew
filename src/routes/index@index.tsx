import { component$, useStore } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Post } from '~/components/post/post';
import   StoriesView   from '~/components/stories/stories';


import Linkify from 'linkify-react';
import * as linkify from 'linkifyjs'
export default component$(() => {
  var publishpopup=useStore({
    state:false
  }
  )
 
return(
  <>

<div class="flex flex-col flex-grow w-screen md:relative ">
<button onClick$={()=>publishpopup.state=!publishpopup.state} class="absolute flex flex-row space-x-[10px] items-center content-center right-10 bottom-24 md:right-15 md:bottom-10  lg:bottom:10 text-white font-semibold  font-inter md:text-md text-sm md:py-4 md:px-7 bg-blue-900 rounded-full"><span class="md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ep:plus"></span><span class="hidden md:inline-flex">New Post</span></button>

<div id="publish" onClick$={(event)=>event.currentTarget==event.target?( event.stopPropagation(),!publishpopup.state?publishpopup.state=!publishpopup.state:0):0} class={`${!publishpopup.state?'hidden':'flex'}  fadeMe  items-center content-center flex flex-row`}>
<div id="popup" class="z-1000  bg-[#0d0d0d] rounded-lg mx-auto">

     <div class="py-3 px-3 flex flex-row">
      <button onClick$={()=>publishpopup.state=!publishpopup.state}>
     <span class="iconify my-1 mx-2 w-[18px] h-[18px] font-sf text-neutral-400 " data-icon="clarity:window-close-line"></span>
     </button>
<button class="px-6 ml-auto py-[8px] right-0 ml-auto text-white font-inter font-medium text-[12px] rounded-md bg-blue-800">Publish</button>
</div>
<textarea 
id="publishtextarea"

class=" outline-none bg-transparent w-72 md:w-96 h-32 mx-5  rounded-md  font-sf   placeholder:text-neutral-400 text-white md:text-md text-sm placeholder:text-md md:text-md placeholder:text-sm  mt-0 px-0 mb-3 border-none"
      placeholder="What's Poppin? @User"
    ></textarea>
    <div class="py-[14px] border-t border-t-neutral-900 px-6 flex flex-row items-center content-center space-x-5" >
      <span class="iconify ml-auto w-[18px] h-[18px] font-sf text-neutral-400 " data-icon="ci:image"></span>
      <span class="iconify w-[18px] h-[18px] font-sf text-neutral-400  " data-icon="ci:youtube"></span>
      <span class="iconify w-[18px]  h-[18px] font-sf text-neutral-400  " data-icon="fluent:gif-16-filled"></span>
    </div>
   
   


    </div>
      </div>
   
   


       <div id="midcont" class=" flex flex-grow flex-col  bg-black bg-opacity-10 md:bg-opacity-0 md:rounded-md    ">

	<div id="tags" class="flex flex-row w-[100%] p-5 space-x-4">
  <StoriesView poster="https://picsum.photos/100/200" name="John Doe" url="https://picsum.photos/300/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/300" name="Jack Steyn" url="https://picsum.photos/100/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/200" name="Amy Bruce" url="https://picsum.photos/200/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/100" name="Sino Wells" url="https://picsum.photos/300/300"></StoriesView>
  <StoriesView poster="https://picsum.photos/300/200" name="Bret Pope" url="https://picsum.photos/200/300"></StoriesView>
  <StoriesView poster="https://picsum.photos/400/300" name="Steve Chris" url="https://picsum.photos/100/300"></StoriesView>
 
 
</div>

<Post title="First Post" about="I am the admin of this app" id="1" user="Admin" username="@admin" published="yesterday" likes="69k" comments="1.4k" content="This is the first post in this app" poster="https://picsum.photos/300/200"></Post>
       </div>

       </div>
    </>
  )
 
 
});




export const head: DocumentHead = {
  title: 'Home',
};
