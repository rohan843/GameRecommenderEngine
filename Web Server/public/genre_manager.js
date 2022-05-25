const allGenreBoxes = document.querySelectorAll('.hidden_genre_class');
const genreBasedSearchForm = document.getElementById('genreBasedSearchForm');
const genreBasedSearchSelect = document.getElementById('genreBasedSearchSelect');

for (let genreBox of allGenreBoxes) {
    genreBox.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const self = e.target;
        const selectedGenre = self.attributes.genre_id.value;
        const merge_by_and = true;
        const url = baseURL + `/search?genres=${selectedGenre}&merge_by_and=${merge_by_and}`;
        window.location.replace(url);
    });
}

genreBasedSearchForm.addEventListener('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const values = $('#genreBasedSearchSelect').val();
    let merge_by_and = true;
    if ($('#merge_by_or').is(":checked")) {
        merge_by_and = false;
    }
    const url = baseURL + `/search?genres=${values.join(',')}&merge_by_and=${merge_by_and}`;
    window.location.replace(url);
});
