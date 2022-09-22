import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
  
return(
    <div class="w-screen py-4 sticky px-4 bg-black bg-opacity-10 flex flex-row items-center content-center">
      <div class="flex flex-row px-1 sm:px-2 space-x-4 items-center content-center">
      <div class="font-bold text-neutral-300 text-xl  font-pacifico"><span class="underline text-blue-500">E</span>volt</div>
    </div>
      <div class="relative ml-auto md:mx-auto md:w-[450px] ">
      <span
          class="iconify absolute md:top-[11px] top-[9px] right-0 text-neutral-400 mx-4 md:mx-5"
          data-icon="ant-design:search"
        ></span>
                <input class="bg-white outline-none bg-opacity-[5%] w-44 md:w-[100%] border border-neutral-700 rounded-md py-[8px] font-inter px-4 md:px-5 pr-[44px] placeholder:text-neutral-500 text-white md:text-sm text-xs placeholder:md:text-sm placeholder:text-xs" placeholder="Search"></input>
      </div>
      <div class="flex items-center content-center ml-5 flex-row space-x-2">
        <img class="w-8 border border-neutral-600 flex-shrink-0 h-8 md:mx-2 md:mr-2 mx-0 mr-1  rounded-full" src="https://picsum.photos/300/500"></img>
      </div>
    </div>
)
}
)
