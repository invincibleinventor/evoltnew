import { $, component$, useResource$, useStore, useTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city';
import { Resource } from '@builder.io/qwik';
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
const msgtrack = useStore({track:0})
    const boxid=loc.params.boxid
    const box = useStore({boxid:boxid})

    const boarded = useStore({user:{},username:'',profile:''})
    const msg = useStore({msg:'',box:0})
    const isLoggedIn = useIsLoggedIn()
    useTask$(()=>{
    if(isLoggedIn){
      boarded.user = isLoggedIn.value.user
     
         
    
    }})
    const msgfetch = useResource$(async({track})=>{
         const value = track(() => loc.params.boxid)
         box.boxid = value;
         track(()=>msgtrack.track)


        const {data,error} = await supabase.from('msgbox').select('*').eq('id',box.boxid)
        const {data:username} = await supabase.from('users').select('username').eq('id',boarded.user["user"]["id"])
        boarded.username = username[0].username

        if(data){
            if(username && username.length>0 && data[0]["privbox"]==false || (data[0]["privbox"]==true && data[0]["members"].includes(username[0]["username"]))){

            const {data:msgdata,error:e} = await supabase.from('messages').select('*').eq('box',box.boxid)
            if(error){
                console.log(error)

            }
            else{
                console.log('hello')
                console.log(msgdata)
            
            return(
                msgdata
            )
            }}
            else{
                console.log('nope')
            }
           

        }
        else{
            console.log(error)
        }
    })
        const sendMsg = $(async()=>{
        console.log(msg.msg)
        if(msg.msg!=''){
        const{error} = await supabase.from('messages').insert({'id':Date.now(),"profile":boarded.profile,"sender":boarded.user["user"]["id"],msg:msg.msg,"sendername":boarded.username,box:box.boxid,receivers:{},isbox:true})

if(error){
    console.log('error'+error?.message)
}
else{
    msg.msg=''
    msgtrack.track=msgtrack.track+1
    console.log(msgtrack.track)
}
   }   })

    const data = useResource$(async({track})=>{


        track(() => loc.params.boxid);
msg.box = Number(boxid)

        const {data,error} = await supabase.from('msgbox').select('*').eq('id',box.boxid)
        const {data:username} = await supabase.from('users').select('username,profile_pic').eq('id',boarded.user["user"]["id"])
        boarded.username = username[0].username
        boarded.profile = username[0].profile_pic

        if(data){
            if(username && username.length>0 && data[0]["privbox"]==false || (data[0]["privbox"]==true && data[0]["members"].includes(username[0]["username"]))){

            return(
                <>
                <img class="w-8 h-8 border border-neutral-800 rounded-full" src={data[0]["boxpic"]}/>
                <h1 class="text-sm font-semibold font-inter text-neutral-200 px-3">{data[0]["boxname"]}</h1>

            </>)
            }
            else{
                return(<h1 class="text-sm font-semibold font-inter text-neutral-200 px-3">Box cannot be accessed</h1>)
            }
        }
        else{
            if(error){
            return(
                <h1 class="text-lg font-semibold font-inter text-white px-3">{error.message}</h1>


            )
            }
        }
    })
    
  return(
    <div class="relative h-screen flex flex-grow flex-col"> 
                <div class="h-[72px] w-full bg-black px-5 py-5 bg-opacity-20 flex flex-row items-center">
   <Resource  value={data}
    onPending={() => <div></div>}
    onRejected={(reason) => <div>Error: {reason}</div>}
    onResolved={(data) => data}></Resource>
    </div>
    <Resource  value={msgfetch}
  onPending={() => <div></div>}
  onRejected={(reason) => <div>Error: {reason}</div>}
  onResolved={(data) => <div class="mx-6 overflow-scroll pb-24 pt-5 flex flex-col space-y-4 lg:space-y-6">
    {data?.map((data:any) => (
        <>
	<div class="flex w-full mt-2 space-x-3 max-w-xs">
    <img src={data.profile} class="flex-shrink-0 h-10 w-10 rounded-full"></img>
    <div>
        <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
            <p class="text-sm">{data.msg}</p>
        </div>
        <span class="text-xs text-gray-500 leading-none">{(data.time).toLocaleString('en-US', { month: 'long' ,date:'2-digit', year:'4-digit'})}</span>
    </div> 
</div>
</>
    ))}
  </div>}></Resource>
    <div class="absolute bottom-0 py-4 bg-neutral-900 h-20 w-full flex flex-grow  space-x-3 px-6" >
        <input placeholder="Type your message" value={msg.msg}             onInput$={(ev) => (msg.msg = (ev.target as HTMLInputElement).value)}
 class="w-full flex rounded-md text-neutral-300 outline-none border border-neutral-700 bg-neutral-500 bg-opacity-10 px-5 py-3 flex-grow"></input>
        <button onClick$={async ()=>sendMsg()} class="  flex flex-row items-center content-center right-0 top-0 left-0 bottom-0 max-w-auto my-auto text-white font-bold md:font-semibold  font-inter md:text-md text-xs h-12 w-12 bg-green-800 rounded-full"><span class=" m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ant-design:arrow-right-outlined"></span></button>

    </div>
    </div>
  )
})




export const head: DocumentHead = {
  title: 'Chat',
};
