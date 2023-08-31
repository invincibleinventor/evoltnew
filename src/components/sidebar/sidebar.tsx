import { component$ } from "@builder.io/qwik";
interface mycmpprops{
  username:string,
  name:string,
  profilepic:string,
  friends:string,
  about:string
}
export const Sidebar = component$((props:mycmpprops) => {
    return(
        <div
        class="sidebarwrapper"
      >
          <div class=" sidebarprofile">

<div class="py-[10px]  pt-0 flex flex-col items-center content-center ">
  <div class="flex flex-row w-full items-center content-center">
<span class="profiletext"
  >Profile
  </span>

  <div class="logtext">Logout</div>
  </div>
  <div class="flex flex-col  mt-6">
    <img class="w-20 h-20 rounded-full mx-auto" src={props.profilepic}></img>
    <div class="font-inter font-semibold pt-5 text-md mx-auto text-neutral-300 my-auto">{props.name}</div>
    <div class="font-inter font-medium pt-[1px] text-[12.75px] mx-auto text-neutral-500 my-auto">@{props.username}</div>
    <div class="font-inter font-medium pt-[18.5px] text-sm mx-auto text-neutral-400 my-auto">{props.about}</div>


  </div>
  </div>


  </div>

       <div class="sidebardivs">
       <span class="quicktext"
          >Quick Actions
          </span>
        
       
        
        
          <div
          class="quickcont"
        >
          <div
            class="flex flex-row space-x-4 mx-auto items-center content-center"
          >
            <button
              class="py-2 px-5 bg-white bg-opacity-[2%] rounded-md"
            >
              <span
                class="iconify text-neutral-300 w-4 h-4"
                data-icon="ep:message"
              ></span>
            </button>
            <button
              class="py-2 px-5 hidden lg:block bg-white bg-opacity-[2%]  rounded-md"
            >
              <span
                class="iconify text-neutral-300 w-4 h-4"
                data-icon="ep:edit"
              ></span>
            </button>
            <button
              class="py-2 px-5 bg-white bg-opacity-[2%]  rounded-md"
            >
              <span
                class="iconify text-neutral-300 w-4 h-4"
                data-icon="ep:setting"
              ></span>
            </button>
            <button
            class="py-2 px-5 bg-white bg-opacity-[2%]  rounded-md"
          >
            <span
              class="iconify text-neutral-300 w-4 h-4"
              data-icon="ep:user"
            ></span>
          </button>
          
          </div>
        </div>
        </div>
        <div class="sidebarmessage">

        <div class="msgcont">
        <span class="pl-[6px] mt-1 text-[15px]  font-medium text-neutral-300 font-sf"
          >Messages
          </span>

          <span class="iconify w-5 h-5 ml-auto mr-1 text-neutral-400 my-auto" data-icon="ep:edit"></span>
          </div>
        
        <div class="flex flex-col my-1 py-1 space-y-[22px] px-1">
          
          <div class="flex flex-row space-x-[10px]">
            <img
              class="w-10 border border-[rgba(0,0,0,0)] flex-shrink-0  h-10 mx-2 mr-1 rounded-md"
              src="https://picsum.photos/100/100"
            />

            <div class="flex flex-col my-auto space-y-[2px] relative w-full">
              <span class="text-[13px] font-semibold font-sf text-neutral-400"> Bon Jovi </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[0px]"> Active Yesterday </span>
            </div>
          </div>

          <div class="flex flex-row space-x-[10px]">
            <img
              class="w-10 border border-[rgba(0,0,0,0)] flex-shrink-0 h-10 mx-2 mr-1 rounded-md"
              src="https://picsum.photos/100/300"
            />

<div class="flex flex-col my-auto space-y-[2px] relative w-full">
              <span class="text-[13px] font-semibold font-sf text-neutral-400"> George Bush </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[0px]"> Online </span>
            </div>
          </div>

          <div class="flex flex-row space-x-[10px]">
            <img
              class="w-10 flex-shrink-0 border border-[rgba(0,0,0,0)] h-10 mx-2 mr-1 rounded-md"
              src="https://picsum.photos/100/200"
            />
             <div class="flex flex-col my-auto space-y-[2px] relative w-full">
              <span class="text-[13px] font-semibold font-sf text-neutral-400"> Alec Ben </span>
              <span class="text-[11px] font-sf text-neutral-500 pl-[0px]"> Last Seen on Aug 19</span>
            </div>
          </div>

        
         
         
          </div>
          </div>
      </div>
    )
})