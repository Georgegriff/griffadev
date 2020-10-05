import { IntersectDetect } from "./components/IntersectDetect";
import "./scroll-collapse";
import "./navigator-share";
// TODO move to page!!
import "lite-youtube-embed/src/lite-yt-embed.js";
import { LiveDemo } from "./components/LiveDemo";
import {GriffSelect} from "./components/GriffSelect";


customElements.define('intersect-detect', IntersectDetect);
customElements.define('griff-select', GriffSelect);
customElements.define('live-demo', LiveDemo);
// TODO move

/* Dom events */
const mainContainer = document.querySelector(".main-content");
mainContainer.root = document;
mainContainer.thresholds = [0.96,0.3];

