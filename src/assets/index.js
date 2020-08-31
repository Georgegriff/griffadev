import { IntersectDetect } from "./components/IntersectDetect";

customElements.define('intersect-detect', IntersectDetect);

/* Dom events */
const mainContainer = document.querySelector(".main-content");
mainContainer.root = document;
mainContainer.thresholds = [0.3, 0.6];
mainContainer.addEventListener('intersection-observed', (e) =>{
    const  {detail} = e;
    const {visible} = detail  || {};
    document.querySelector(".sticky-title").setAttribute("aria-hidden", Boolean(visible))
})