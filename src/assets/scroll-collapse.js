/* show hide controls todo consider custom elements */

// Initial state
let scrollPos = 0;
let hideTimer
// adding scroll event
window.addEventListener(
  "scroll",
  function () {
    const box = document.body.getBoundingClientRect();
    hideTimer = setInterval(() => {
        document
        .querySelector(".actionbar")
        .classList.add("action-hide"); 
    }, 8000);
    // at bottom
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            clearInterval(hideTimer);
            document
            .querySelector(".actionbar")
            .classList.remove("action-hide");
    } else if(window.scrollY === 0) {
        clearInterval(hideTimer);
        document
        .querySelector(".actionbar")
        .classList.remove("action-hide");
    } else if (document.body.getBoundingClientRect().top > scrollPos) {
      clearInterval(hideTimer);
      setTimeout(() => {
          // if still scrolling up now show
          if(document.body.getBoundingClientRect().top >= scrollPos) {
            document
            .querySelector(".actionbar")
            .classList.remove("action-hide");
          }
      }, 800)
     
    } else {
    setTimeout(() => {
      document
        .querySelector(".actionbar")
        .classList.add("action-hide");
    }, 300)
    }
    // saves the new position for iteration.
    scrollPos = document.body.getBoundingClientRect().top;
  },
  { passive: true }
);
