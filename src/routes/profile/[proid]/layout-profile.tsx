import { useLocation } from '@builder.io/qwik-city';
import { component$, Slot } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';


export const data = {
    taylor:{
        name: 'A Taylor Swift',
        username: '@Taylor_Swift',
        about: 'I make music that i write',
        cover: 'https://iheart-blog.s3.amazonaws.com/banner/originals/0_a_aaaTSwiftBanner.jpg',
        profile: 'https://gracemcgettigan.files.wordpress.com/2015/01/tay.jpg',
        followers: '129M',

    },
    sean:{
        name: 'A Sean Paul',
        username: '@Sean_Paul',
        about: 'Sean Paul is a Jamaicam singer/songwriter known for his pop classics',
        cover: 'https://i.pinimg.com/originals/30/58/6a/30586a6e4209906100fa2f470cd0a819.jpg',
        profile: 'https://wallpapercave.com/wp/wp5979216.jpg',
        followers: '69M',

    }
}
export default component$(() => {

  const location = useLocation();
  var profile = location.params.proid;
  const namess = location.params.proid;
  return(
    
<div  class=" flex flex-grow   flex-col bg-white bg-opacity-10 md:bg-opacity-0 py-0 md:space-y-4">
<div class="xl:relative   md:m-5 m-3">
  
<div class={`h-44 lg:h-[203px] rounded-lg bg-cover `} style={`background-image:
linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, .6) 40%, rgba(0, 0, 0, .8) 65%, rgba(0, 0, 0, 1) 100%),
url('${data[profile].cover}');

background-size: cover;

`}></div>

<div class="xl:absolute  w-full xl:left-10  xl:top-[120px] xl:right-0 mx-auto mt-7 xl:mt-0 flex flex-col">
<img class="xl:w-[100px] xl:h-[100px] shadow-xl border border-neutral-800 w-20 mx-auto xl:mx-0 h-20 rounded-full" src={`${data[profile].profile}`}></img>
<div class="flex-grow flex flex-col xl:block">
<div class="flex flex-row xl:top-[20px] xl:left-[125px] mx-auto xl:mx-0 xl:absolute none    mt-3 xl:mt-0">
<div class=" flex flex-col mx-auto xl:mx-0">
<span class="xl:text-lg  mx-auto  xl:mx-0 text-lg font-semibold font-sf text-neutral-300">{data[profile].name} </span>
<span class="xl:text-[12.5px]  mt-1  xl:mt-[0px] text-center xl:text-left leading-relaxed xl:px-0 xl:w-full sm:w-3/4 leading-5 xl:mx-0 mx-auto px-8 text-[12px]  font-sf text-neutral-400">{data[profile].about}</span>
</div>
</div>
<button class="xl:absolute xl:right-[90px] shadow-lg xl:top-[25px] px-8 mx-auto xl:mx-0  h-max text-xs xl:text-sm  text-white font-semibold bg-blue-600 overflow-y-hidden py-2 xl:my-0 my-5 xl:rounded-md">Follow</button>

</div> 
</div>
</div>


</div>
)})