import { $, Resource, component$, useResource$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { supabase } from '~/services/supabase';
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
  
export default component$(()=>{
    const loc = useLocation()
    const boarded = useStore({user:{},username:''})
    const isLoggedIn = useIsLoggedIn()
  
    useVisibleTask$(async()=>{
   
    if(isLoggedIn){
        boarded.user = isLoggedIn.value.user
       
           
      
      }})
      const joinBox = $(async(id:any,username:any)=>{
        let members:any = []
        const {data,error} = await supabase.from('msgbox').select('*').eq('id',id)
        if(error){

          console.log(error.message)
        }
        else{
          if(data){
            members = data[0]["members"]
            if(members.includes(username)==false)
            members.push(username)
            else{
             
              window.location.href="/box/"+id
            
            }
          }
        }
        const {data:d,error:e} = await supabase.from('msgbox').upsert({"id":id,"members":members})
        if(e){

          console.log(e.message)
        }
        else{
          if(d){
            console.log('d')
            window.location.reload()
          }
        }
      })
const boxDetails =  useResource$(async()=>{
  if(isLoggedIn){
    console.log(loc.params.boxid)
    const {data,error} = await supabase.from('msgbox').select('*').eq('id',loc.params.boxid)
if(data && data.length>0){
  console.log(data[0]["privbox"])
  console.log(boarded.username)
 const {data:username} = await supabase.from('users').select('username').eq('id',boarded.user)

  if(data[0]["privbox"]==false || (data[0]["privbox"]==true && data[0]["allowed"].includes(username))){
    return (
      <div class="flex flex-col text-neutral-300 items-center content-center w-full h-full">
   <img class="w-16 h-16 rounded-full border border=neutral-600 my-6" src={data[0]["boxpic"]}></img>
        <h1 class="text-neutral-200 font-semibold text-lg">{data[0]["boxname"]}</h1>
        <h1 class="text-neutral-400 font-medium text-md my-2">Members:<span class="font-normal px-1 text-neutral-400">{data[0]["members"].length}</span></h1>
        <button onClick$={async ()=>joinBox(data[0]["id"],username)} class=" mx-auto mt-5 flex flex-row space-x-[10px] items-center content-center right-0 top-0 left-0 bottom-0 max-w-auto my-auto text-white font-bold md:font-semibold  font-inter md:text-md text-xs md:py-4 px-4 pr-8 md:px-8 bg-green-800 rounded-full"><span class="md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ant-design:arrow-right-outlined"></span><span class="inline-block ">Join {data[0]["boxname"]}</span></button>
      </div>
    )
  }
  else{
    return <h1 class="font-medium text-white text-lg">You aren't authorized to access this Box</h1>
  }
}
   else{
    return error?.message
   }
  }
  else{
    return <h1 class="font-medium text-white text-lg">You aren't authorized to access this Box</h1>
  }
  })
   
  return(
    <>return
     <div class="bgcol flex flex-col content-center items-center">
      <div class="px-20 py-14 bg-neutral-800 rounded-lg bg-opacity-20 my-auto">
      <Resource
  value={boxDetails}
  onPending={() => <div>Loading...</div>}
  onRejected={(reason) => <div>Error: {reason}</div>}
  onResolved={(data:any) => <div>{data}</div>}
/>
       
</div>
    </div>
    </>
  )
})




export const head: DocumentHead = {
  title: "Join Box",
};
