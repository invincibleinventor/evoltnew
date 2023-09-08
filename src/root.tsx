import { component$, createContextId, useContextProvider, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import { Head } from './components/head/head';
import styles from './modern.css'
import type { Session } from "@supabase/supabase-js";
import { supabase } from './services/supabase';

export interface IuserDetails {
  isLoggedIn: boolean
  session: Session | null
}
export const userDetailsContext = createContextId<IuserDetails>("userDetails");

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
  *
  * Don't remove the `<head>` and `<body>` elements.
  */

  const userDetails = useStore<IuserDetails>({ isLoggedIn: false, session: null })
  useContextProvider(userDetailsContext, userDetails)
  useTask$(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (data.session) {
      console.log(data.session)
      userDetails.isLoggedIn = true
      userDetails.session = data.session
    }
    if (error) {
      console.error(error)
      userDetails.isLoggedIn = false
      userDetails.session = null
    }
  })
useStyles$(styles)
  return (
    
    <QwikCityProvider>
      <Head>
      </Head>
      <body lang="en" class="relative w-screen h-screen">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
