import { component$ ,useStore, useVisibleTask$, $} from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { supabase } from '~/services/supabase';
export default component$(async () => {
 
  const signIn = $(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  })
  const userDetails = useStore({user:{}})
  useVisibleTask$(async ()=>{
    const { data, error } = await supabase.auth.getSession()
    userDetails.user = data.session?data.session.user:{}
    if(Object.keys(userDetails.user).length>0){}
    if(error){alert(error)}
     
  })
 console.log(userDetails.user)
  
const a = userDetails.user
let b = false;
async function checkboarding(a){
  const {data,error} = await supabase.from('users').select('*').eq('id',a.id)
  if(data && data.length>0){
    window.location.replace('/')
    console.log(data)
    return true
  }
  else {
    console.log(error)

    return false
  }

}


 if(Object.keys(a).length>0){console.log('yes');console.log(JSON.stringify(a));if(await checkboarding(a)!=false){window.location.replace('/')}b=true}else{console.log('no');b=false}
 if(b){
  return (<></>)}})


export const head: DocumentHead = {
  title: 'Onboarding',
};