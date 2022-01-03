exports.getWatchlistMovies = () => {
    /*
    Date: January-03-2022
    Instructions: 
    1. Go to your watchlist on JustWatch using your favorite web browser.
    2. Load the whole page (JustWatch uses pagination, you must load all the items by scrolling down).
    3. Paste the followings lines in the console once the page is fully loaded.
    4. Do the same with the already seen movies watchlists.
    */
    let movies = [...document.querySelectorAll('.title-card')];
    const results = movies.map(movie => {
        let name = movie.querySelector('.title-card-heading').firstChild.textContent.trim();
        let year = movie.querySelector('.title-card-heading__info')?.textContent;
        if (year) year = /\d+/.exec(year)?.[0] ?? undefined;
        let liked = movie.querySelector("div[aria-label='Like'] .title-poster-quick-actions-content__bubbles__item--visible");
        let disliked = movie.querySelector("div[aria-label='Dislike'] .title-poster-quick-actions-content__bubbles__item--visible");
        const rating = liked ? 1 : disliked ? -1 : 0;
        return { name, year, rating };
    });
    return results;
}

exports.getWatchlistTVShows = () => {
    /*
    Date: January-03-2022
    Instructions: 
    1. Go to your watchlist on JustWatch using your favorite web browser.
    2. Load the whole page (JustWatch uses pagination, you must load all the items by scrolling down).
    3. Paste the followings lines in the console once the page is fully loaded.
    4. Do the same with the already seen TV Shows watchlists.
    */
    let results = [...document.querySelectorAll('.title-card-show-episode__title-name')].map(tv => {
        return { name: tv.firstChild.textContent.trim(), seen: false }
    });
    return results;
}

exports.getWatchedTVShows = () => {
    /*
    Date: January-03-2022
    Instructions: 
    1. Go to your watchlist on JustWatch using your favorite web browser.
    2. Load the whole page (JustWatch uses pagination, you must load all the items by scrolling down).
    3. Paste the followings lines in the console once the page is fully loaded.
    4. Do the same with the already seen TV Shows watchlists.
    */
    let results = [...document.querySelectorAll('.title-card')].map(tv => {
        return { name: tv.querySelector('.title-card-heading').firstChild.textContent.trim(), seen: true }
    });
    return results;
}