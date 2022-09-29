import { component$ } from '@builder.io/qwik';

export const Publish = component$(() => {
return(
    <button class="absolute flex flex-row space-x-[10px] items-center content-center right-10 bottom-10 md:right-15 md:bottom-15 lg:right-20 lg:bottom:20 text-white font-semibold  font-inter md:text-md text-sm md:py-4 md:px-7 bg-blue-600 rounded-full"><span class="md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ep:plus"></span><span class="hidden md:inline-flex">New Post</span></button>
)
})