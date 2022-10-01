/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import React from 'react';


export const TabsView = qwikify$(()=>{
    var [test,setTest] =React.useState(0)
    return(
        <div>
        <button onClick={()=>setTest(test + 1)}>Click</button>
        <>{test}</>
    
    </div>)
})