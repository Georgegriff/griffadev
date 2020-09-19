const checkbox = document.querySelector('#theme');

const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
if (darkMode) {
    darkMode.onchange = (e) => {
        if(e.matches) {
            checkbox.checked = false;
        }
        localStorage.removeItem("theme-switch-on");
    }
}

const lightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)')
if(lightMode) {
    lightMode.onchange = (e) => {
        if(e.matches) {
            checkbox.checked = false;
        }
        localStorage.removeItem("theme-switch-on");
    }
}


const toggleTheme = () => {
    const themePreference = localStorage.getItem("theme-switch-on");
    if(themePreference) {
        // toggle the theme switcher on, depending on their OS settings for prefs could be light or dark
        checkbox.checked = true;
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
        animateTransition();
        // todo make it save and respect preferences!
    } else {
        localStorage.removeItem("theme-switch-on");
        animateTransition();
    }
})

let animateTransition = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 1000)
}