import { component$, mutable } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
export const Menu = component$(() => {
    const loc = useLocation().url;
    return(
      <div class="settingsmenucont">
        <div
        class="settingsmenumain mx-1 md:mx-0  "
      >
      <Link id="central" href="/settings"  class={(`flex flex-row-reverse items-center content-center md:space-x-3 px-2 md:mx-2 mx-1 py-3 md:py-[8px] ${loc.pathname==='/settings/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify  md:w-4 md:h-4 w-5 h-5 md:ml-auto md:mx-0 mx-2 md:mr-2 my-auto" data-icon="tabler:user"></span>
        <span class="hidden md:inline-flex font-inter text-[13.5px] my-auto ">Profile</span>
      </Link>
      <Link id="search" href="/settings/privacy/"  class={(`flex flex-row-reverse items-center content-center md:space-x-3 px-2 mx-1 md:mx-2 py-3 md:py-[8px] ${loc.pathname==='/settings/privacy/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify  md:w-4 md:h-4 w-5 h-5 md:ml-auto md:mx-0 mx-2 md:mr-2 my-auto" data-icon="tabler:shield"></span>
        <span class="hidden md:inline-flex   font-inter text-[13.5px] my-auto ">Privacy</span>
      </Link>
      <Link id="clips" href="/settings/personalize/"  class={(`flex flex-row-reverse items-center content-center md:space-x-3 px-2 mx-1 md:mx-2 py-3 md:py-[8px] ${loc.pathname==='/settings/personalize/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify  md:w-4 md:h-4 w-5 h-5 md:ml-auto md:mx-0 mx-2 md:mr-2 my-auto" data-icon="tabler:palette"></span>
        <span class="hidden md:inline-flex    font-inter text-[13.5px] my-auto ">Personalize</span>
      </Link>
      <Link id="favourites" href="/settings/info/"  class={(`flex flex-row-reverse items-center content-center md:space-x-3 px-2  mx-1 md:mx-2 py-3  md:py-[8px] ${loc.pathname==='/settings/info/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify   md:w-4 md:h-4 w-5 h-5  md:ml-auto md:mx-0 mx-2 md:mr-2 my-auto" data-icon="tabler:help"></span>
        <span class="hidden md:inline-flex   font-inter text-[13.5px] my-auto ">Info and Help</span>
      </Link>
     
     
    
      </div>
      </div>
    )
})