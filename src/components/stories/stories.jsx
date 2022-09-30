import { Link } from '@builder.io/qwik-city';
import Linkify from 'react-linkify';

function StoriesView(props){
	return(
		<div style={`background-image:
linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 10%, rgba(0, 0, 0, .6) 40%, rgba(0, 0, 0, .8) 65%, rgba(0, 0, 0, 1) 100%),
url('${props.url}');

background-size: cover;

`} class=" flex flex-col h-36 w-28 p-2 rounded-md">
<img class="rounded-full w-8 h-8 m-1 flex-shrink-0 " src={props.poster}></img>
<span class="text-neutral-300 text-xs ml-1 mb-1 font-inter font-semibold mt-auto text-left">{props.name}</span>
		</div>
		

	)
}
export default StoriesView;
