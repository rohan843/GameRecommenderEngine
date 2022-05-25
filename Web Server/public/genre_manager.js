const allGenreBoxes = document.querySelectorAll('.hidden_genre_class');
for (let genreBox of allGenreBoxes) {
    genreBox.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const self = e.target;
        console.log(self.attributes.genre_id.value);
    });
}
