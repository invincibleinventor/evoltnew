import { component$ } from "@builder.io/qwik";
export const Sidebar = component$(() => {
    return(
        <div
        class="h-auto hidden bg-black bg-opacity-20 border-l border-l-neutral-900 md:flex flex-col px-4 py-4 w-[300px] lg:w-[335px]"
      >
       
       <span class="pl-2 mt-1 text-md  font-medium text-neutral-400 font-sans"
          >Quick Links
          </span>
        
       
        
        
          <div
          class="mb-4 mt-4 rounded-sm px-2 flex flex-row items-center content-center"
        >
          <div
            class="flex flex-row space-x-4 mx-auto items-center content-center"
          >
            <button
              class="py-2 px-5 bg-black bg-opacity-20 border border-neutral-600 rounded-full"
            >
              <span
                class="iconify text-neutral-400 w-4 h-4"
                data-icon="ep:message"
              ></span>
            </button>
            <button
              class="py-2 px-5 bg-black bg-opacity-20 border border-neutral-600 rounded-full"
            >
              <span
                class="iconify text-neutral-400 w-4 h-4"
                data-icon="ep:edit"
              ></span>
            </button>
            <button
              class="py-2 px-5 bg-black bg-opacity-20 border border-neutral-600 rounded-full"
            >
              <span
                class="iconify text-neutral-400 w-4 h-4"
                data-icon="ep:setting"
              ></span>
            </button>
            <button
            class="py-2 px-5 bg-black bg-opacity-20 border border-neutral-600 rounded-full"
          >
            <span
              class="iconify text-neutral-400 w-4 h-4"
              data-icon="ep:user"
            ></span>
          </button>
          
          </div>
        </div>
        <div class="py-2 flex flex-row items-center content-center px-1">
        <span class="pl-[6px] mt-1 text-md  font-medium text-neutral-400 font-sans"
          >Messages
          </span>

          <span class="iconify w-5 h-5 ml-auto mr-1 text-neutral-400 my-auto" data-icon="ep:edit"></span>
          </div>
        
        <div class="flex flex-col my-1 py-1 space-y-[22px] px-1">
          
          <div class="flex flex-row space-x-3">
            <img
              class="w-10 flex-shrink-0 border border-neutral-600 h-10 mx-2 mr-1 rounded-full"
              src="https://picsum.photos/100/200"
            />

            <div class="flex flex-col my-auto space-y-[0px] relative w-full">
              <span class="text-[13px] font-bold font-sf text-neutral-400"> Billy Eilish </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[1px]"> Active Yesterday </span>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <img
              class="w-10 flex-shrink-0 border border-neutral-600 h-10 mx-2 mr-1 rounded-full"
              src="https://picsum.photos/100/200"
            />

            <div class="flex flex-col my-auto space-y-[0px] relative w-full">
              <span class="text-[13px] font-bold font-sf text-neutral-400"> PewDewPie </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[1px]"> Online </span>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <img
              class="w-10 flex-shrink-0 border border-neutral-600 h-10 mx-2 mr-1 rounded-full"
              src="https://picsum.photos/100/200"
            />

            <div class="flex flex-col my-auto space-y-[0px] relative w-full">
              <span class="text-[13px] font-bold font-sf text-neutral-400"> Will Smith </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[1px]"> Active 3m Ago </span>
            </div>
          </div>

          <div class="flex flex-row space-x-3">
            <img
              class="w-10 flex-shrink-0 border border-neutral-600 h-10 mx-2 mr-1 rounded-full"
              src="https://picsum.photos/100/200"
            />

            <div class="flex flex-col my-auto space-y-[0px] relative w-full">
              <span class="text-[13px] font-bold font-sf text-neutral-400"> Taylor Swift </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[1px]"> Inactive Since Febraury </span>
            </div>
          </div>
         
         
        </div>
      </div>
    )
})