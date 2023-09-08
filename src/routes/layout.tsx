/* eslint-disable qwik/use-method-usage */
// @ts-ignore

import { component$, useStore,Slot, useContext } from '@builder.io/qwik';

import { supabase , setSupabaseCookie} from '~/services/supabase';
import {useVisibleTask$, useTask$,$ } from '@builder.io/qwik';
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import { userDetailsContext } from '~/root';
import Sidebar from '~/components/sidebar/sidebar';
export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useIsLoggedIn = routeLoader$(async (requestEv) => {
  
  const { cookie } = requestEv
  const refreshToken = cookie.get('my-refresh-token')?.value ?? ""
  const accessToken = cookie.get('my-access-token')?.value ?? ""
  
  const { data } = await supabase.auth.getUser(accessToken)
  await supabase.auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  })
  const { data: sessionData } = await supabase.auth.getSession()

  return { isLoggedIn: data.user != null, session: sessionData.session , user: data}
})

export default component$(() => {
  const signIn = $(async () => {
    const {  error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if(error){
      alert(error.message)
    }
    else{
     // console.log(data)

    }
  })
  
  const isLoggedIn = useIsLoggedIn()
  const userDetails = useContext(userDetailsContext)
  const boarded = useStore({boarded:false,user:{}})

  //console.log(useIsLoggedIn())
  useTask$(async() => {
    userDetails.isLoggedIn = isLoggedIn.value.isLoggedIn
    userDetails.session = isLoggedIn.value.session 
    boarded.user = isLoggedIn.value.user
  })

 // console.log(boarded.user["user"])
    useVisibleTask$(async()=>{
      if(userDetails.isLoggedIn){
    
  //console.log(boarded.user["user"]["id"])
    const {data,error} =await supabase.from('users').select('*').eq('id',boarded.user["user"]["id"])
    if(data && data.length>0){
 //  console.log(data)
      boarded.boarded=true
    }
    else{
      error?alert(error.message):console.log("");
   
        window.location.replace('/onboarding')
      
      //console.log(error)
    }
 
}})
 // console.log(boarded.user)
  //console.log(boarded.boarded)

  useVisibleTask$(() => setSupabaseCookie())

    
 if(userDetails.isLoggedIn){
  if(boarded.boarded==true){
  return (
<>

    <div class="bgcol mb-6">
      <main class="flex flex-row w-screen flex-grow overflow-hidden ">
      
 <Sidebar id={boarded.user["user"]["id"]}></Sidebar>
    
      <Slot />
      </main>
    </div>

        </>
  );

 }
 else{
  return(<></>)
 }}
 else{
  return(
  <div class="bgcol flex flex-col content-center items-center">
      <div class="px-20 py-14 bg-neutral-800 rounded-lg bg-opacity-20 my-auto">
        <h1 class="font-semibold font-sf text-lg text-white text-center mb-8">Sign In to continue</h1>
        <button onClick$={async ()=>signIn()} class=" mx-auto mt-5 flex flex-row space-x-[10px] items-center content-center right-0 top-0 left-0 bottom-0 max-w-auto my-auto text-white font-bold md:font-semibold  font-inter md:text-md text-xs md:py-4 px-4 pr-8 md:px-8 bg-green-800 rounded-full"><span class="md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ant-design:google-outlined"></span><span class="inline-block ">Sign In With Google</span></button>
</div>
    </div>)
 }

 
})

