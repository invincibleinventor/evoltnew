import { useLocation } from '@builder.io/qwik-city';
import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export const data = {
    taylor:{
        name: 'Taylor Swift',
        username: '@Taylor_Swift',
        about: 'I make music that i write',
        cover: 'https://iheart-blog.s3.amazonaws.com/banner/originals/0_a_aaaTSwiftBanner.jpg',
        profile: 'https://gracemcgettigan.files.wordpress.com/2015/01/tay.jpg',
        followers: '129M',

    },
    sean:{
        name: 'A Sean Paul',
        username: '@Sean_Paul',
        about: 'Sean Paul is a Jamaicam singer/songwriter known for his pop classics',
        cover: 'https://i.pinimg.com/originals/30/58/6a/30586a6e4209906100fa2f470cd0a819.jpg',
        profile: 'https://wallpapercave.com/wp/wp5979216.jpg',
        followers: '69M',

    }
}
export default component$(() => {

  const location = useLocation();
  var profile = location.params.proid;
  const namess = location.params.proid;

  return (
<></>
  );
});




