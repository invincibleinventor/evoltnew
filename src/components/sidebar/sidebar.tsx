import { component$, useSignal, useResource$, Resource } from "@builder.io/qwik";
import { supabase } from "~/services/supabase";
interface myProps{
    id:any
}
export default component$((props:myProps)=>{
    const a = props.id

    const list = useSignal()

  const data = useResource$(async()=>{
      //  console.log(a)
    const {data} = await supabase.from('users').select('boxes').eq('id',a)

 
    if(data && data.length>0){
        //console.log(data[0]["boxes"])
           
            const {data:d,error:e} = await supabase.from('msgbox').select('*').in('id',data[0]['boxes'])
            if(d){
          //  console.log(d)
            // eslint-disable-next-line qwik/valid-lexical-scope
            list.value=JSON.parse(JSON.stringify(d))
            return d
        
        }

            else{
                console.log(e?.message)
            }
    }
    // eslint-disable-next-line qwik/valid-lexical-scope
  //  const newObj` = list.value
//console.log(newObj)
})


console.log(list.value)

    return(
        <div class="h-full flex flex-grow w-max py-4 px-4 flex-col space-y-4 bg-black text-neutral-300 bg-opacity-10">
        <Resource  value={data}
  onPending={() => <div></div>}
  onRejected={(reason) => <div>Error: {reason}</div>}
  onResolved={(data) => <div>
    {data?.map((data:any) => (
      <p>{data.id}</p>
    ))}
  </div>}></Resource>
        </div>
    )
})