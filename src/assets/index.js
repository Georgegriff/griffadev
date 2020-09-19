import { IntersectDetect } from "./components/IntersectDetect";
import "./scroll-collapse";
// TODO move to page!!
import "lite-youtube-embed/src/lite-yt-embed.js";
import { LiveDemo } from "./components/LiveDemo";
import {GriffSelect} from "./components/GriffSelect";

customElements.define('intersect-detect', IntersectDetect);
customElements.define('griff-select', GriffSelect);
// TODO move
customElements.define('live-demo', LiveDemo);

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