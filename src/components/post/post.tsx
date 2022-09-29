import { component$ } from "@builder.io/qwik";
import Linkify from 'linkify-react'
interface mycmpprops{
    
user: string,
username: string,
published: string,
content:string,
likes:string,
comments:string,

image?:string,
poster:string,



}
const options = {}



export const Post = ((props: mycmpprops) => {

    return(
        <div class="px-4  lg:pr-6 md:pr-5 border-b border-b-neutral-800 pb-3 md:rounded-xl md:bg-black md:bg-opacity-10">
  <div class="py-4 pb-[10px] lg:pb-4 flex flex-col">
    <div class="flex flex-row">
      <div class="flex items-center content-center flex-row space-x-2">
        <img
          class="w-10 flex-shrink-0 border border-neutral-600 h-10 mx-1 md:mx-2 rounded-full"
          src={props.poster}
        />
  <div class="flex flex-col">
        <div class="flex font-sf flex-row items-center content-center space-y-[0px]">
          <span class=" text-neutral-300 font-sans font-semibold text-[14px]"
            >{props.user}</span>
          <span class=" text-neutral-400  font-sans pl-[10px] md:text-[12px] text-[11px]"
            >{props.username}</span>
          
        </div>
        <span class="text-xs font-sf md:pt-[2px] text-neutral-500">
        <span class="hidden md:inline-flex">Posted</span> {props.published}
      </span>
        </div>
      </div>

    </div>
  </div>
  <div class="px-1 md:px-2">
    <span id="posttext"  class="  posttext text-[13px] font-sf  md:text-sm  lg:text-[15px] text-neutral-300 text-left my-1 leading-normal lg:leading-relaxed ">
        {props.content}
   </span>
 
    
{props.image?
    <div class="  lg:py-4 md:py-4 sm:py-4 py-2 pt-3  ">  <img class="w-full lg:max-w-[430px] max-w-[350px] mx-auto md:mx-0 rounded-md md:rounded-xl h-auto" src="https://picsum.photos/400/300"></img>
  </div>
  :<></>}
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
        <span class="text-neutral-400 text-[12.5px]  ">{props.likes} <span class="lg:inline-block hidden">Likes</span></span>
      </button>
      <button
        class="flex pl-1 flex-row space-x-2 items-center content-center"
      >
        <span
          class="iconify text-neutral-400"
          data-icon="ep:comment"
        ></span>
        <span class="text-neutral-400 text-[12.5px] ">{props.comments} <span class="lg:inline-block hidden">Comments</span></span>
      </button>
    </div>
    <span
      class="text-blue-400 opacity-100 ml-auto text-xs font-inter text-neutral-300"
    >
      <span class="hidden lg:inline-block">View all comments</span><span class="md:hidden inline-block">View More</span>
    </span>
  </div>
  </div>
  
  
    )
})