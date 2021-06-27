document.getElementById('example-1').addEventListener('click', () => {
    const imgToGrid =document.querySelector('img-to-grid');
    imgToGrid.setAttribute('src', './assets/cat.png')
    imgToGrid.totalColors = 8;
});
document.getElementById('example-2').addEventListener('click', () => {
    const imgToGrid =document.querySelector('img-to-grid');
    imgToGrid.setAttribute('src', './assets/pizza.png')
    imgToGrid.totalColors = 16;
});
