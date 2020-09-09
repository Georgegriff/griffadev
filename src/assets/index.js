import { IntersectDetect } from "./components/IntersectDetect";
import "./scroll-collapse";
// TODO move to page!!
import "lite-youtube-embed/src/lite-yt-embed.js";

customElements.define('intersect-detect', IntersectDetect);

/* Dom events */
const mainContainer = document.querySelector(".main-content");
mainContainer.root = document;
mainContainer.thresholds = [0.7,0.3];

var checkbox = document.querySelector('#theme');

checkbox.addEventListener('change', function() {
    if(this.checked) {
        trans()
        // todo make it save and respect preferences!
    } else {
        trans()
    }
})

let trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 1000)
}


// remove the link so can work without js
document.querySelector('lite-youtube a.no-js').addEventListener('click', (e) => {
    e.preventDefault();
})