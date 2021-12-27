import { IntersectDetect } from "./components/IntersectDetect";
import "./scroll-collapse";
import "./navigator-share";
// TODO move to page!!
import "lite-youtube-embed/src/lite-yt-embed.js";
import { LiveDemo } from "./components/LiveDemo";
import { GriffSelect } from "./components/GriffSelect";
import { GriffLoader } from "./components/Loader";
import { CopyToClipboard } from "./components/CopyToClipboard";

customElements.define("intersect-detect", IntersectDetect);
customElements.define("griff-select", GriffSelect);
customElements.define("griff-loader", GriffLoader);
customElements.define("live-demo", LiveDemo);
customElements.define("copy-to-clipboard", CopyToClipboard);
// TODO move

/* Dom events */
const mainContainer = document.querySelector(".main-content");
mainContainer.root = document;
mainContainer.thresholds = [0.96, 0.3];
