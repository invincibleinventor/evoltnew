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
        <div id="midcont" class="h-screen flex flex-col flex-grow md:py-10 p-6 px-8">
            <div class="flex flex-row items-center content-center space-x-[12px]">
            <img class="w-5 h-5 rounded-full" src={image} > </img>

                 <h1 class="text-[12px] md:text-[12px] font-inter   text-neutral-300 opacity-90 ">Posted by TeamEvolt
</h1>
</div>
<h1 class="text-[20px]  md:text-[20.75px] lg:text-[21.5px] my-4 mb-0 font-inter font-semibold  text-neutral-300 ">Did you expect to see a dynamically rendered post here?
</h1>

<h1 class="text-[14px] md:text-[14.5px] lg:text-[15px] sm:mt-[10px] lg:mt-3 lg:mb-5 my-[17px] mb-[13px] lg:mb-[10px] md:mb-3 font-inter leading-relaxed text-neutral-400 ">Well I did too, and do you know why it isn't the case? Well the guy that had to do backend is high right now. He hasn't been replying to my messages whenever i question him of when he thinks of doing. You understand my situation don't you? I dont care if you don't too
</h1>

<div class={`  py-3 pt-[12px] ${!image?`hidden`:`flex`}  `}>    <img class="w-auto rounded-md mx-auto md:mx-0  h-auto" src={image}></img>
</div>
        </div>
    );
  });