import { IntersectDetect } from "./components/IntersectDetect";
import "./scroll-collapse";

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