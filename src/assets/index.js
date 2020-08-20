import { IntersectDetect } from "./components/IntersectDetect";
customElements.define('intersect-detect', IntersectDetect);


/* Dom events */
document.querySelector(".main-content").addEventListener('intersection-observed', (e) =>{
    const  {detail} = e;
    const {visible} = detail  || {};
    document.querySelector(".sticky-title").setAttribute("aria-hidden", Boolean(visible))
})