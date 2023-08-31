import { component$, Slot } from '@builder.io/qwik';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';
import { Sidebar } from '~/components/sidebar/sidebar';
import { supabase } from '~/services/supabase';
import { useVisibleTask$,$,useStore } from '@builder.io/qwik';
export default component$(async () => {

  const signIn = $(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  })
  const userDetails = useStore({user:{},details:{}})
  useVisibleTask$(async ()=>{
    const { data, error } = await supabase.auth.getSession()
    userDetails.user = data.session?data.session.user:{}
    if(error){alert(error)}
     
  })
 console.log(userDetails.user)
  
const a = userDetails.user
let b = false;
async function checkboarding(a){
  const {data,error} = await supabase.from('users').select('*').eq('id',a)
  if(data && data.length>0){
    console.log(data)
    userDetails.details=data[0]
  }
  else {
    return false
  }
 if(error){
  console.log(error)
 }
}

 if(Object.keys(a).length>0){console.log('yes');console.log(JSON.stringify(a));if(await checkboarding(JSON.parse(JSON.stringify(a["id"])))==false){window.location.replace('/onboarding')};b=true}else{console.log('no');b=false}
 if(b){
  return (

    <div class="bgcol mb-6">
      <Header />
      <main class="flex flex-row w-screen flex-grow overflow-hidden ">
      
      <Menu />

      <Slot />
      <Sidebar />
      </main>
    </div>
  );
 }
 
});
