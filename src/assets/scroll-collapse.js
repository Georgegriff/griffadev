/* show hide controls todo consider custom elements */

// Initial state
let scrollPos = 0;
let hideTimer;
// adding scroll event
window.addEventListener(
  "scroll",
  function () {
    const box = document.body.getBoundingClientRect();
    // at bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      document.querySelector(".actionbar") &&
        document.querySelector(".actionbar").classList.remove("action-hide");
    } else if (window.scrollY === 0) {
      document.querySelector(".actionbar") &&
        document.querySelector(".actionbar").classList.remove("action-hide");
    } else if (box.top > scrollPos) {
      setTimeout(() => {
        // if still scrolling up now show
        if (document.body.getBoundingClientRect().top >= scrollPos) {
          document.querySelector(".actionbar") &&
            document
              .querySelector(".actionbar")
              .classList.remove("action-hide");
        }
      }, 300);
    } else {
      document.querySelector(".actionbar") &&
        document.querySelector(".actionbar").classList.add("action-hide");
    }
    // saves the new position for iteration.
    scrollPos = document.body.getBoundingClientRect().top;
  },
  { passive: true }
);
