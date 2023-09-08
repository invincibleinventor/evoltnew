import { component$, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { supabase } from "~/services/supabase";
interface myProps{
    id:any
}
export default component$((props:myProps)=>{
    const a = props.id

    const list = useStore({items:{}})
    useTask$(async()=>{
        console.log(a)
    const {data,error} = await supabase.from('users').select('boxes').eq('id',a)


 
    if(data && data.length>0){
        console.log(data[0]["boxes"])
        const a: any[] = []
        for(let i = 0; i <=data[0]['boxes'].length-1;i++){
        const {data:d,error:e} = await supabase.from('msgbox').select('*').eq('id',data[0]['boxes'][i])
        a.push(d)
        if(e){
            console.log(e.message)
        }
        }
      
       
    }
    else{
        if(error)
        console.log(error.message)
    }
})
console.log('below')
console.log(list.items)


    return(
        <div class="h-full flex flex-grow w-max py-4 px-4 flex-col space-y-4 bg-black bg-opacity-10">
        </div>
    )
})