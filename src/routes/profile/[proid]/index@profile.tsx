// @ts-ignore

import {  $,component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { supabase } from '~/services/supabase';


export default component$( () => {

  const userDetails = useStore({user:{},details:{},followers:{},following:false,personal:{}})
  
 const id = useLocation().params.proid;
 const a = useStore({user:{}})
 useVisibleTask$(async ()=>{
  const { data, error } = await supabase.auth.getSession()
  userDetails.user = data.session?data.session.user:{}
  async function pers(){
    const {data,error} = await supabase.from('users').select('*').eq('id',userDetails.user.id)
    userDetails.personal=data[0]
    
  }
  await pers()
  if(error){alert(error)}
  console.log(userDetails.user.id)
  async function getfollowers(){
    console.log(id)
    const {data,error} = await supabase.from('followers').select('*').eq('username',id);
    if(data){
      userDetails.followers=data[0]
      console.log('below')
      console.log(data[0])
    }
    else{
      console.log(error)
    }
  }  
  await getfollowers()
  
  async function check(){
    const {data,error} = await supabase.from('users').select('*').eq('username',id)
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
   await check()
})
const follow = $(async () => {
  Array.prototype.removeByValue = function (val) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === val) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  }
  let as = (userDetails.followers["followers"])
  let ab = (userDetails.personal["following"])
  console.log(ab)
  console.log('mid')
  console.log(as)
  if (as.includes(userDetails.personal["username"])){
    userDetails.following=false;
    console.log(userDetails.following)
    ab=ab.removeByValue(id)

    as=as.removeByValue(userDetails.personal["username"])
    const {data,error} = await supabase.from('followers').upsert({"id":a.user["id"],"username":id,"followers":as})
    let s = userDetails.personal
    s.following = ab

async function dothis(){
  const {data,error} = await supabase.from('users').upsert(s)

}
await dothis()

  }
else{

  as.push(userDetails.personal["username"])
  ab.push(id)
  const {data,error} = await supabase.from('followers').upsert({"id":a.user["id"],"username":id,"followers":as})
  let s = userDetails.personal
  s.following = ab
  async function dothis(){
    const {data,error} = await supabase.from('users').upsert(s)


  }
  await dothis()
  userDetails.following=true;

}
  
}
)



 
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
<img src={a.user["profile_pic"]}class="xl:w-[100px] xl:h-[100px] shadow-xl border border-neutral-800 w-20 mx-auto xl:mx-0 h-20 rounded-full" />
<div class="flex-grow flex flex-col xl:block">
<div class="flex flex-row xl:top-[20px] xl:left-[125px] mx-auto xl:mx-0 xl:absolute none    mt-6 xl:mt-0">
<div class=" flex flex-col mx-auto xl:mx-0">
<span class="xl:text-lg  mx-auto  xl:mx-0 text-lg font-semibold font-sf text-neutral-300">{a.user["name"]}<span class="pl-[6px] text-sm font-normal text-neutral-400">@{a.user["username"]}</span></span>
<span class="xl:text-[12.5px]  font-medium mt-1  xl:mt-[2px] text-center xl:text-left leading-relaxed xl:px-0 xl:w-full xs:w-3/4 md:w-auto leading-5 xl:mx-0 mx-auto px-8 text-[12px]  font-sf text-neutral-400">{a.user["about"]}</span>
</div>
</div>
<button onClick$={()=>follow()} class={userDetails.user.id==a.user["id"]?"hidden":`xl:absolute xl:right-[65px] shadow-lg xl:top-[25px] px-8 mx-auto xl:mx-0  h-max text-xs xl:text-sm  text-white font-semibold ${userDetails.following?'bg-neutral-500':'bg-green-800'} overflow-y-hidden py-2 xl:my-0 mt-4 mb-0 rounded-md`}>{userDetails.following?'Unfollow':'Follow'}</button>

</div> 
</div>
<div class="mt-5 flex flex-grow w-auto">
  <div class="flex flex-row space-x-5 items-center content-center xl:ml-auto xl:mr-5 mx-auto">
  <h1 class=" lg:text-md text-sm text-neutral-300 font-medium">Followers <span class="font-normal text-xs lg:text-sm">{}</span></h1>
  <h1 class=" lg:text-md text-sm text-neutral-300 font-medium">Following <span class="font-normal text-xs lg:text-sm">{}</span></h1>
</div>
</div>
</div>

</div>
)})