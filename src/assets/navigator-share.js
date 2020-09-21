window.addEventListener("load",() => {
    if(navigator.share) {
        const nativeShare = document.querySelector('.native-share');
        if (nativeShare) {
            nativeShare.style.display = "flex";
            nativeShare.addEventListener('click', (e) => {
                const button = e.currentTarget;
                navigator.share({
                    text:button.getAttribute("data-text"),
                    title: button.getAttribute("data-title"),
                    url: button.getAttribute("data-url")
                  }).then(() => {
                    nativeShare.classList.add('shared');
                  }).catch(() =>  {
                  })
            });
        }
    }
})