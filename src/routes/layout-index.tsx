import { component$, Slot,$, useVisibleTask$, useStore, useSignal} from '@builder.io/qwik';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { Sidebar } from '~/components/sidebar/sidebar';
import  StoriesView  from '~/components/stories/stories'
import { supabase } from '~/services/supabase';
export default component$(() => {

  const signIn = $(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  })
  const userDetails = useStore({user:{}})
  useVisibleTask$(async ()=>{
    const { data, error } = await supabase.auth.getSession()
    userDetails.user = data.session?data.session.user:{}
    if(error){alert(error)}
     
  })
 console.log(userDetails.user)
  
const a = userDetails.user
let b = false;

 if(Object.keys(a).length>0){console.log('yes'+a);b=true}else{console.log('no');b=false}
 if(b){
  return (
    <div class="bgcol ">
      <Header />
      
      <main class="flex flex-row md:flex-row w-screen flex-grow overflow-hidden ">
      
      <Menu />
      <div class="w-screen flex flex-col">        
     	<div id="tags" class="flex flex-row w-[100%] p-5 space-x-4">
  <StoriesView onClick$={()=>{console.log('ok')}} poster="https://picsum.photos/100/200" name="John Doe" url="https://picsum.photos/300/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/300" name="Jack Steyn" url="https://picsum.photos/100/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/200" name="Amy Bruce" url="https://picsum.photos/200/400"></StoriesView>
  <StoriesView poster="https://picsum.photos/200/100" name="Sino Wells" url="https://picsum.photos/300/300"></StoriesView>
  <StoriesView poster="https://picsum.photos/300/200" name="Bret Pope" url="https://picsum.photos/200/300"></StoriesView>
  <StoriesView poster="https://picsum.photos/400/300" name="Steve Chris" url="https://picsum.photos/100/300"></StoriesView>
 
 
</div><Slot /></div>


      <Sidebar />
      </main>

    </div>
  );
  }
 else{
  
    return( <div class="bgcol flex flex-col content-center items-center">
      <div class="px-20 py-14 bg-neutral-800 rounded-lg bg-opacity-20 my-auto">
        <h1 class="font-semibold font-sf text-lg text-white text-center mb-8">Sign In to continue</h1>
<button onClick$={async ()=>signIn()} class=" flex flex-row space-x-[10px] items-center content-center right-0 top-0 left-0 bottom-0 max-w-auto my-auto text-white font-semibold  font-inter md:text-md text-sm md:py-4 px-4 pr-8 md:px-8 bg-red-700 rounded-full"><span class="md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ant-design:google-outlined"></span><span class="inline-block ">Login With Google</span></button>
</div>
    </div>)
 }
});
