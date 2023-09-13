import { component$, useSignal, useResource$, Resource } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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
        <div class="h-full flex  py-4 w-max flex-col items-center content-center space-y-4 bg-black text-neutral-300 bg-opacity-30">
        <Resource  value={data}
  onPending={() => <div></div>}
  onRejected={(reason) => <div>Error: {reason}</div>}
  onResolved={(data) => <div class="mx-6 flex flex-col space-y-4 lg:space-y-6">
    {data?.map((data:any) => (
                      <Link href={"/box/"+data["id"]} class={`lg:w-12 w-10 h-10 lg:h-12 border border-neutral-800 rounded-full `} style={`background-image: url('${data["boxpic"]}');`}></Link>

    ))}
  </div>}></Resource>
        </div>
    )
})