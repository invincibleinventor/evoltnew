import { component$, useStore } from "@builder.io/qwik";

import React from 'react';
interface mycmpprops{
    
user: string,
username: string,
published: string,
content:string,
likes:string,
title:string,
comments:string,

image?:string,
poster:string,
id:string,
about:string



}



export var Post = component$((props: mycmpprops) => {
  
  const options = {}
    return(
    
     <>
     <div class="flex flex-row    border-b border-b-[#121212] ">
     <img class={`hidden w-full lg:max-w-[430px] max-h-auto max-w-[350px] absolute  h-full`} src={props.image}></img>
     <div class="w-max h-full py-4 px-[16px] bg-[#121212] flex flex-col space-y-[18px]">
     <span class="text-neutral-500 iconify w-4 h-4" data-icon="ant-design:heart"></span>
     <span class="text-neutral-500 iconify w-4 h-4" data-icon="ant-design:message"></span>
     </div>
        <div class="flex flex-col px-4 py-4">
        

          <div class="flex flex-row bg-white bg-opacity-[3%] w-max px-[10px] py-[6px] rounded-sm items-center content-center mb-[8px] md:mb-[10px] space-x-[8px]">
          <img class="w-[14px] h-[14px] rounded-full " src={props.poster} > </img>

          <h1 class="text-[9.5px] md:text-[10.5px] font-sans mt-[1.5px] md:mt-[1px] text-neutral-400 font-medium  ">{props.user}</h1>


          </div>
          <div class="">
        <h1 onClick$={()=>window.location.href=`/posts/${props.id}`} class={` md:leading-normal leading-5 text-[14.5px] cursor-pointer md:text-[15.9px] lg:text-[16.5px] font-inter  ${`md:mt-[0px] mt-[1px] mb-[4px]`} font-medium text-neutral-300 md:opacity-90 `}>{props.title}</h1>
        <h1 class="text-[12px] md:text-[13.5px] font-inter  text-[#7b7b7b] ">{props.content}</h1>

        <div class={`  py-3 pb-[2px] pt-[16px] ${!props.image?`hidden`:`flex`}  `}>    <img class="w-full lg:max-w-[430px] max-h-full  max-w-[350px] mx-auto md:mx-0  h-full" src={props.image}></img>
</div>
        </div>
        </div>
        <div class=""></div>
     </div>
     </>
  
    )
    
   
})


/* <div class="postcont">
  <div class="py-4 flex flex-col">
    <div class="flex flex-row">
      <div class="flex items-center content-center flex-row space-x-2">
        <img
          class="w-10 flex-shrink-0 border border-neutral-600 h-10 mx-1 md:mx-2 rounded-full"
          src="https://picsum.photos/300/500"
        />
  
        <div class="flex font-sf flex-col space-y-[1.5px]">
          <span class=" text-neutral-300 font-inter font-semibold text-[13px]"
            >Booby Eyelash</span>
          <span class=" text-neutral-400 font-inter text-[10px]"
            >@._Booby_Eyelash.</span>
          
        </div>
      </div>
      <span class="text-xs pt-1 ml-auto font-sf text-neutral-500">
        <span class="hidden md:inline-flex">Posted</span> Yesterday
      </span>
    </div>
  </div>
  <div class="px-1 md:px-2">
    <span id="posttext"  class="  posttext style13 font-sf  md:text-sm  lg:text-[15px] text-neutral-300 text-left my-1 lg:leading-relaxed ">
      People and opinons exist, and it is upto u to listen to them. #bryh https://google.com
    </span>
    <div class="  lg:py-4 md:py-4 sm:py-4 py-2 pt-4  ">    <img class="w-full lg:max-w-[430px] max-w-[350px] mx-auto md:mx-0 rounded-md md:rounded-xl h-auto" src="https://picsum.photos/400/300"></img>
  </div>
  </div>
  <div class="px-1 md:pr-0  py-2 flex font-sf flex-row w-full mt-1">
    <div class="flex flex-row space-x-8">
      <button
        class="flex pl-1 flex-row space-x-2 items-center content-center"
      >
        <span
          class="iconify text-neutral-400"
          data-icon="ant-design:heart"
        ></span>
        <span class="text-neutral-400 text-xs  ">420k <span class="lg:inline-block hidden">Likes</span></span>
      </button>
      <button
        class="flex pl-1 flex-row space-x-2 items-center content-center"
      >
        <span
          class="iconify text-neutral-400"
          data-icon="ep:comment"
        ></span>
        <span class="text-neutral-400 text-xs ">69k <span class="lg:inline-block hidden">Comments</span></span>
      </button>
    </div>
    <span
      class="text-blue-400 opacity-100 ml-auto text-xs font-inter text-neutral-300"
    >
      <span class="hidden lg:inline-block">View all comments</span><span class="md:hidden inline-block">View More</span>
    </span>
  </div>
  </div>
  
  
  */  