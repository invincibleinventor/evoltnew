import { createQwikCity } from '@builder.io/qwik-city/middleware/netlify-edge';
import qwikCityPlan from '@qwik-city-plan';

import render from './entry.ssr';

const qwikCityHandler = createQwikCity({render,qwikCityPlan});

export default qwikCityHandler;