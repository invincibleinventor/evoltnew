import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Post } from '~/components/post/post';
import { Stories } from '~/components/stories/stories';

export default component$(() => {
return(
  <>

<div class="flex flex-col flex-grow ">
<Stories></Stories>

       <div id="midcont" class="flex flex-grow   flex-col md:px-4 bg-black bg-opacity-10 md:bg-opacity-0 px-1 py-4 md:space-y-4">
        <Post user="TeamEvolt" username='@TeamEvolt' poster='https://picsum.photos/300/400' content='This is the first post on #evolt' likes='1' comments='0' published='Yesterday'></Post>
        <Post user="Admin - Evolt" username='@AdminEvolt' poster='https://picsum.photos/200/300' content='Hiyo I am the admin of #evoltapp' likes='3' comments='0' published='2 Days Ago'></Post>
        <Post user="Admin - Evolt" image="https://picsum.photos/500/600" username='@AdminEvolt' poster='https://picsum.photos/200/300' content='Image Posting test' likes='0' comments='0' published='2 Days Ago'></Post>

       </div>

    </div>
    </>
  )
 
 
});



export const head: DocumentHead = {
  title: 'Home',
};
