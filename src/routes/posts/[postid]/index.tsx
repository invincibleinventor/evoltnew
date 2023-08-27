import { useLocation } from '@builder.io/qwik-city';
import { component$, _useMutableProps } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';


export default component$(() => {

    const location = useLocation();
    var profile = location.params.proid;
    const namess = location.params.proid;


    var title="I love how professors still rant about For Loop being unrealistic"
    var content="cmon guys for loop is always better than while and still some java nerds claim for to be a memory hog. guys grow up for fcks sake"
    var id=location.params.proid
    var image = "https://picsum.photos/500/600"
    return (
        <div id="midcont" class="h-screen flex  flex-col flex-grow md:py-10 p-6 px-8">
            <div class="flex flex-row items-center content-center  ">

            <div class="flex flex-row items-center content-center space-x-[12px] mr-auto">
            <img class="w-5 h-5 rounded-full" src={image} > </img>
                 <h1 class="text-[12px] md:text-[12px] font-inter   text-neutral-300 opacity-90 "><span class="hidden md:inline-flex">Posted by</span> Admin
</h1>
</div>

<h1 class="text-[12px]  md:text-[12px] font-inter   text-neutral-400 ">September 19 2022
</h1>
</div>
<h1 class="text-[20px]  md:text-[20.75px] lg:text-[20.75px] my-6 md:my-5  mb-0 font-inter font-semibold  text-neutral-300 ">Example of a dynamically rendered post. Work under progress
</h1>

<h1 class="text-[14px] md:text-[14.5px] lg:text-[14.5px] md:mt-0 mt-[14px] lg:mb-5  mb-[13px] lg:mb-[10px] md:mb-3 font-inter leading-relaxed text-neutral-400 ">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut egestas sollicitudin odio in egestas. Vivamus commodo massa in lacus luctus, id pellentesque turpis facilisis. Nunc at pharetra lectus, porttitor sollicitudin sapien. Etiam blandit pharetra mollis. Aliquam eget ipsum quis mi semper iaculis. Ut tincidunt tempor diam id tincidunt. 
</h1>

<div class={`  py-3 lg:pt-4 pt-[12px] ${!image?`hidden`:`flex`}  `}>    <img class="w-auto rounded-[5px] mx-auto sm:mx-0  h-auto" src={image}></img>
</div>
        </div>
    );
  });
