import { component$ ,useStore, useVisibleTask$, $} from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { supabase } from '~/services/supabase';
export default component$(async () => {
 
  const signIn = $(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  })
  const userDetails = useStore({user:{},boarded:false})
  const state = useStore({image:''})
  useVisibleTask$(async ()=>{
    const { data, error } = await supabase.auth.getSession()
    userDetails.user = data.session?data.session.user:{}
   
    if(error){alert(error)}
    const a = userDetails.user
async function checkboarding(){
  const {data,error} = await supabase.from('users').select('*').eq('id',a.id)
  if(data && data.length>0){
    window.location.replace('/')
    console.log(data)
    return true
  }
  else {
    console.log('nodata')
    console.log(error)

    return false
  }

}

userDetails.boarded = await checkboarding()

     
  })
  console.log('belo')
 console.log(userDetails.user)
  const a = userDetails.user
  let b = userDetails.boarded

  const handleSubmit$ = $( async (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = form.name2.value;
    const dob=form.dob.value;
    const about = form.about.value;
    const username = form.username.value;
    const {data,error} = await supabase.from('users').upsert({name:name,about:about,dob:dob,username:username})
async function update(){
  const {data,error} = await supabase.from('followers').upsert({username:username,followers:{}})
  if(data){
  alert(data)
  console.log(data)
  }
  else{
    alert(error)
  }
}
await update()
    console.log(data)
    if(error){
      console.log(error)
      alert(error.code)
    }
    else{
      window.location.reload()
    }
  })
//console.log("a"+c)
 if(Object.keys(a).length>0){console.log('yes');console.log(JSON.stringify(a));if(b!=false){window.location.replace('/')}b=true}else{console.log('no');b=false}
 if(b){
  return (<>
  <div class="bgcol flex flex-col content-center items-center">
      <div class="px-10 md:px-20 py-14 bg-neutral-800 rounded-2xl bg-opacity-20 my-auto">
        <h1 class="font-semibold font-inter text-2xl text-white text-center mb-2">Welcome To Evolt!</h1>
        <div class="relative block group">
    
    
</div>
        <form  class=" w-auto px-4 lg:px-0 mx-auto" preventdefault:submit onSubmit$={handleSubmit$}>
                    <div class="pb-1 pt-4">
                    <span class="mb-2 text-neutral-300 text-sm ml-1">Your Name</span>

                        <input type="text" name="name2" id="name2" placeholder="Your Name" class="outline-1 mt-2 outline outline-neutral-800  block w-auto p-3 px-5  text-neutral-300 text-md rounded-lg bg-black bg-opacity-30"/>
                    </div>
                    <div class="pb-1 pt-4">
                    <span class="mb-2 text-neutral-300 text-sm ml-1">An Username</span>

                    <input class="block w-auto mt-2 p-3 text-md bg-black bg-opacity-30 outline-1 outline outline-neutral-800 rounded-lg text-neutral-300 px-5 " type="text" name="username" id="username" placeholder="An Username"/>
                    </div>
                    <div class="pb-1 pt-4 ">
                      <span class="mb-2 text-neutral-300 text-sm ml-1">Date Of Birth</span>
                    <input class="block w-full p-3 mt-2 text-md bg-black bg-opacity-30 outline-1 outline outline-neutral-800 rounded-lg text-neutral-300 px-5 " type="date" name="dob" id="dob" placeholder="Date Of Birth"/>
                    </div>
                    <div class="pb-1 pt-4 ">
                      <span class="mb-2 text-neutral-300 text-sm ml-1">About Yourself (In 100 characters)</span>
                    <textarea maxLength={100} class="block w-full p-3 mt-2 text-md bg-black bg-opacity-30 outline-1 outline outline-neutral-800 rounded-lg text-neutral-300 px-5 "  name="about" id="about" placeholder="Tell us a bit about yourself"/>
                    </div>
                    <button type="submit" class=" mx-auto mt-5 flex flex-row space-x-[10px] items-center content-center right-0 top-0 left-0 bottom-0 max-w-auto my-auto text-white font-bold md:font-semibold  font-inter md:text-md text-xs md:py-4 px-4 pr-8 md:px-8 bg-green-800 rounded-full"><span class="md:m-0 m-4 iconify font-bold w-5 h-5 md:w-4 md:h-4" data-icon="ant-design:arrow-right-outlined"></span><span class="inline-block ">Complete Onboarding</span></button>

                    </form>
</div>
    </div>
    </>)}})


export const head: DocumentHead = {
  title: 'Onboarding',
};