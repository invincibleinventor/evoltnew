import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {


  return (

    <div class="bgcol">
     
      <main class="flex flex-row-reverse md:flex-row w-screen overflow-hidden ">
      
     <Slot></Slot>
      </main>
    </div>
  );
});
