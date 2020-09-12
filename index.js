//Non reusable code for our very specific projects
// fetchData()-> finctin to finf movie
//renderOption()-> function that knows how to render a movie 
//onOptionSelect() -> function that gets invoked when a user clicks an option
//root - element that the autocompplet should be rendered into s


const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
      `;
    },

    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '79995781',
                s: searchTerm
            }
        });

        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    },
}


createAutoComplete({
    ...autoCompleteConfig, //the ... means -> to copy everything from the function 
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector("#left-summary"), 'left');
    }

});
createAutoComplete({
    ...autoCompleteConfig, //the ... means -> to copy everything from the function 
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie; //to hold on the informations
let rightMovie;// they are storing the references 

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '79995781',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary'); //is-primary is what makes it GREEN
            leftStat.classList.add('is-warning'); //its what makes it yellow
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });

}


const movieTemplate = movieDetail => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const rating = parseInt(movieDetail.imdbRating);
    const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    console.log(awards)


    return `
        <article class="media" >
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article >
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtile">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtile">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtile">Metascore</p>
        </article>
        <article data-value=${rating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtile">IMDB Rataing</p>
        </article>
        <article data-value = ${votes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtile">Imdb Votes</p>
        </article>
        `;
};


