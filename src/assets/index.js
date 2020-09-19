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

const toggleTheme = () => {
    const themePreference = localStorage.getItem("theme-switch-on");
    if(themePreference) {
        // toggle the theme switcher on, depending on their OS settings for prefs could be light or dark
        // or if matchMedia not supported on = dark
        checkbox.checked = true
    } else {
        checkbox.checked = false;
    }
}
toggleTheme();

// for multi tabs
window.addEventListener('storage', () => {
    toggleTheme();
})

checkbox.addEventListener('change', function() {
    let defaultTheme = 'light';
    const darkModeMediaQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if(darkModeMediaQuery && darkModeMediaQuery.matches) {
        defaultTheme = 'dark';
    }
    if(this.checked) {
        // remember preference
        localStorage.setItem("theme-switch-on", true);
        trans()
        // todo make it save and respect preferences!
    } else {
        localStorage.removeItem("theme-switch-on");
        trans()
    }
})

let trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 1000)
}