import { IntersectDetect } from "./components/IntersectDetect";
import "./scroll-collapse";
import "./navigator-share";
// TODO move to page!!
import "lite-youtube-embed/src/lite-yt-embed.js";
import { LiveDemo } from "./components/LiveDemo";
import {GriffSelect} from "./components/GriffSelect";


window.addEventListener('load',() => {
    // safari is really annoying and for some reason the use of slots here breaks the animation
    setTimeout(() => {
        customElements.define('intersect-detect', IntersectDetect);
    })
    customElements.define('griff-select', GriffSelect);
    customElements.define('live-demo', LiveDemo);
})
// TODO move

/* Dom events */
const mainContainer = document.querySelector(".main-content");
mainContainer.root = document;
mainContainer.thresholds = [0.7,0.3];

