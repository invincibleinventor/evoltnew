import render from './entry.ssr';
import { qwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';

export const onRequest = qwikCity(render);


const qwikCityHandler = qwikCity(render);

export default qwikCityHandler;