import { Slot, component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { supabase } from '~/services/supabase';


export default component$(async () => {
 
  const userDetails = useStore({user:{},details:{}})
  
 const id = useLocation().params.proid;
 const a = useStore({user:{}})
 useVisibleTask$(async ()=>{
  const { data, error } = await supabase.auth.getSession()
  userDetails.user = data.session?data.session.user:{}
  
  if(error){alert(error)}
  console.log(userDetails.user.id)
   
})

 async function check(an:any){
  const {data,error} = await supabase.from('users').select('*').eq('username',an)
  if(data){
  a.user=data[0]
  console.log(a.user["id"],userDetails.user.id)
  }
  else {
    return false
  }
 if(error){
  console.log(error)
 }
} 

await check(id)


 
  return(
    
<div  class=" flex flex-grow   flex-col bg-white bg-opacity-10 md:bg-opacity-0 py-0 md:space-y-4">
<div class="xl:relative   md:m-5 m-3">
  
<div class="h-44 lg:h-[203px] rounded-lg bg-cover" style={`
  background-image:
linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, .6) 40%, rgba(0, 0, 0, .8) 65%, rgba(0, 0, 0, 1) 100%),
url('${a.user["cover"]}');

background-size: cover;

`}></div>

<div class="xl:absolute  w-full xl:left-10  xl:top-[120px] xl:right-0 mx-auto mt-7 xl:mt-0 flex flex-col">
<img class="xl:w-[100px] xl:h-[100px] shadow-xl border border-neutral-800 w-20 mx-auto xl:mx-0 h-20 rounded-full" />
<div class="flex-grow flex flex-col xl:block">
<div class="flex flex-row xl:top-[20px] xl:left-[125px] mx-auto xl:mx-0 xl:absolute none    mt-6 xl:mt-0">
<div class=" flex flex-col mx-auto xl:mx-0">
<span class="xl:text-lg  mx-auto  xl:mx-0 text-lg font-semibold font-sf text-neutral-300">{a.user["name"]}<span class="pl-[6px] text-sm font-normal text-neutral-400">@{a.user["username"]}</span></span>
<span class="xl:text-[12.5px]  mt-1  xl:mt-[3px] text-center xl:text-left leading-relaxed xl:px-0 xl:w-full sm:w-3/4 leading-5 xl:mx-0 mx-auto px-8 text-[12px]  font-sf text-neutral-400">{a.user["about"]}</span>
</div>
</div>

<button class={userDetails.user.id!=a.user["id"]?"hidden":`xl:absolute xl:right-[90px] shadow-lg xl:top-[25px] px-8 mx-auto xl:mx-0  h-max text-xs xl:text-sm  text-white font-semibold bg-blue-600 overflow-y-hidden py-2 xl:my-0 my-4 rounded-md`}>Follow</button>

</div> 
</div>
</div>

<Slot/>
</div>
)})