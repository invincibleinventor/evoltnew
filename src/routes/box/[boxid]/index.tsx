import { component$, useResource$, useStore } from '@builder.io/qwik';
import { DocumentHead, useLocation } from '@builder.io/qwik-city';
import { Resource } from '@builder.io/qwik';
import { supabase } from '~/services/supabase';
export default component$(()=>{
    const loc = useLocation()


    const data = useResource$(async({track})=>{

        const boxid=loc.params.boxid
        track(() => loc.params.boxid);



        const {data,error} = await supabase.from('msgbox').select('*').eq('id',boxid)
        if(data){
            return(
                <>
                <img class="w-8 h-8 border border-neutral-800 rounded-full" src={data[0]["boxpic"]}/>
                <h1 class="text-sm font-semibold font-inter text-neutral-200 px-3">{data[0]["boxname"]}</h1>

            </>)
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
    <div class="relative flex flex-grow flex-col"> 
                <div class="h-[72px] w-full bg-black px-5 py-5 bg-opacity-20 flex flex-row items-center">
   <Resource  value={data}
    onPending={() => <div></div>}
    onRejected={(reason) => <div>Error: {reason}</div>}
    onResolved={(data) => data}></Resource>
    </div>
    <div class="absolute bottom-0 h-max w-full flex flex-grow px-4" >
        <input class="w-full flex flex-grow"></input>
    </div>
    </div>
  )
})




export const head: DocumentHead = {
  title: 'Chat',
};
