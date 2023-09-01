import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
export const Menu = component$(() => {
    const loc = useLocation().url;
    
    return(
      <div class="menucont">
        <div
        class="menumain md:mx-0 mx-1 "
      >
      <Link id="central" href="/"  class={(`flex flex-row-reverse items-center content-center space-x-3 px-2 md:mx-2 mx-1 py-3 lg:py-[8px] ${loc.pathname=='/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify  lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto" data-icon="tabler:home"></span>
          <span class="hidden lg:inline-flex font-inter text-[13.5px] my-auto ">Home</span>
      </Link>
      <Link id="search" href="/search"  class={(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-1 md:mx-2  py-3 lg:py-[8px] ${loc.pathname=='/search/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify  lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto" data-icon="tabler:search"></span>
        <span class="hidden lg:inline-flex   font-inter text-[13.5px] my-auto ">Search</span>
      </Link>
      <Link id="clips" href="/clips"  class={(`flex flex-row-reverse items-center content-center space-x-3 px-2 mx-1 md:mx-2  py-3 lg:py-[8px] ${loc.pathname=='/clips/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify  lg:w-4 lg:h-4 w-5 h-5 lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto" data-icon="tabler:video"></span>
        <span class="hidden lg:inline-flex    font-inter text-[13.5px] my-auto ">Clips</span>
      </Link>
      <Link id="favourites" href="/favs"  class={(`flex flex-row-reverse items-center content-center space-x-3 px-2  mx-1 md:mx-2  py-3 lg:py-[8px] ${loc.pathname=='/favs/'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify   lg:w-4 lg:h-4 w-5 h-5  lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto" data-icon="ant-design:heart"></span>
        <span class="hidden lg:inline-flex   font-inter text-[13.5px] my-auto ">Favourites</span>
      </Link>
      <Link id="settings" href="/settings"  class={(`flex  md:mt-auto ml-auto flex-row-reverse items-center content-center space-x-3 px-2  mx-1 mr-[6px] md:mx-2  py-3 lg:py-[8px] ${loc.pathname==='/settings'?'selected-sidebar-bg selected-sidebar-text selected-sidebar-icon':'unselected-sidebar-bg unselected-sidebar-text unselected-sidebar-icon'}`)}>
        <span class="iconify   lg:w-4 lg:h-4 w-5 h-5  lg:ml-auto lg:mx-0 mx-2 lg:mr-2 my-auto" data-icon="ant-design:setting"></span>
        <span class="hidden lg:inline-flex   font-inter text-[13.5px] my-auto ">Settings</span>
      </Link>
   
     
    
      </div>
      </div>
    )
})