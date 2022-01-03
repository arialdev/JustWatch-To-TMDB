import fetch from "node-fetch";
import justwatchData from "./src/movies.json";
import * as fs from "fs";

async function findMovieIDByName(title, year = undefined) {
  const url =
    `${process.env.API_URL}/search/movie?query=${title}` +
    (year ? `&year=${year}` : '');
  let request = await fetch(encodeURI(url), {
    headers: {
      Authorization: process.env.API_TOKEN,
    },
  });
  let response = await request.json();
  return response.total_results ? response.results[0].id : null;
}

async function findTVShowIDByName(title, year = undefined) {
  const url = `${process.env.API_URL}/search/tv?query=${title}${(year ? `&first_air_date_year=${year}` : '')}`;
  let request = await fetch(encodeURI(url), {
    headers: {
      Authorization: process.env.API_TOKEN,
    },
  });
  let response = await request.json();
  return response.total_results ? response.results[0].id : null;
}

async function updateMoviesWatchedList(watched, listID) {
  logger(`Adding ${watched.length} movies to the list with ID ${listID}...`, true);

  const promises = [];
  let errors = 0;

  for (let i = 0; i < watched.length; i++) {
    let promise = new Promise(resolve => {
      findMovieIDByName(watched[i].name, watched[i].year).then(movieID => {
        addMovieToList(movieID, listID).then(res => {
          res.movie = watched[i];
          if (!res.success) {
            ++errors;
            logger(`${i}. ERROR adding movie with ID ${movieID} to list with ID ${listID}\n\t${JSON.stringify(res)}`)
          }
          else {
            logger(`${i}. Successfully added movie with ID ${movieID} to list with ID ${listID}\n\t${JSON.stringify(res)}`)
          }
          resolve(movieID);
        })
      });
    });
    promises.push(promise)
  }

  const results = await Promise.all(promises);
  logger(`\nFinished adding ${watched.length} movies into list with ID ${listID}. Errors: ${errors}`)
  return results;
}

async function updateTVShowsWatchedList(watched, listID) {
  logger(`Adding ${watched.length} tv shows to the list with ID ${listID}...`, true);

  const promises = [];
  let errors = 0;

  for (let i = 0; i < watched.length; i++) {
    let promise = new Promise(resolve => {
      findTVShowIDByName(watched[i].name, watched[i]?.year).then(tvID => {
        addTVShowToList(tvID, listID).then(res => {
          res.tvShow = watched[i];
          if (!res.success) {
            ++errors;
            logger(`${i}. ERROR adding tv show with ID ${tvID} to list with ID ${listID}\n\t${JSON.stringify(res)}`)
          }
          else {
            logger(`${i}. Successfully added tv show with ID ${tvID} to list with ID ${listID}\n\t${JSON.stringify(res)}`)
          }
          resolve(tvID);
        })
      });
    });
    promises.push(promise)
  }

  const results = await Promise.all(promises);
  logger(`\nFinished adding ${watched.length} tv shows into list with ID ${listID}. Errors: ${errors}`)
  return results;
}

async function updateMoviesWatchlist(watched) {
  logger(`Adding ${watched.length} movies into watchlist...`, true);

  const promises = [];
  let errors = 0;

  for (let i = 0; i < watched.length; i++) {
    let promise = new Promise(resolve => {
      findMovieIDByName(watched[i].name, watched[i].year).then(movieID => {
        addMovieToWatchlist(movieID).then(res => {
          res.movie = watched[i];
          if (res.status_code == 201) {
            logger(`${i}. Successfully added movie with ID ${movieID} into watchlist\n\t${JSON.stringify(res)}`);
          }
          else {
            ++errors;
            logger(`${i}. ERROR adding movie with ID ${movieID} into watchlist\n\t${JSON.stringify(res)}`);
          }
          resolve(movieID);
        })
      });
    });
    promises.push(promise)
  }

  const results = await Promise.all(promises);
  logger(`\nFinished adding ${watched.length} movies into watchlist. Errors: ${errors}`)
  return results;
}

async function updateTVShowsWatchlist(watched) {
  logger(`Adding ${watched.length} tv shows into watchlist...`, true);

  const promises = [];
  let errors = 0;

  for (let i = 0; i < watched.length; i++) {
    let promise = new Promise(resolve => {
      findTVShowIDByName(watched[i].name, watched[i].year).then(tvID => {
        addTVShowToWatchlist(tvID).then(res => {
          res.tvShow = watched[i];
          if (res.status_code === 201) {
            logger(`${i}. Successfully added tv show with ID ${tvID} into watchlist\n\t${JSON.stringify(res)}`);
          }
          else {
            ++errors;
            logger(`${i}. ERROR adding tv show with ID ${tvID} into watchlist\n\t${JSON.stringify(res)}`);
          }
          resolve(tvID);
        })
      });
    });
    promises.push(promise)
  }

  const results = await Promise.all(promises);
  logger(`\nFinished adding ${watched.length} movies into watchlist. Errors: ${errors}`)
  return results;
}

async function addMovieToList(movieID, listID) {
  const url = `${process.env.API_URL}/list/${listID}/items`;
  const body = {
    "items": [
      {
        "media_type": "movie",
        "media_id": movieID
      }
    ]
  };
  const request = await fetch(encodeURI(url), {
    method: 'POST',
    hostname: "api.themoviedb.org",
    body: JSON.stringify(body),
    headers: {
      "authorization": process.env.API_ACCESS_TOKEN,
      "content-type": "application/json;charset=utf-8"
    }
  });
  const response = await request.json();
  return response;
}

async function addTVShowToList(tvID, listID) {
  const url = `${process.env.API_URL}/list/${listID}/items`;
  const body = {
    "items": [
      {
        "media_type": "tv",
        "media_id": tvID
      }
    ]
  };
  const request = await fetch(encodeURI(url), {
    method: 'POST',
    hostname: "api.themoviedb.org",
    body: JSON.stringify(body),
    headers: {
      "authorization": process.env.API_ACCESS_TOKEN,
      "content-type": "application/json;charset=utf-8"
    }
  });
  const response = await request.json();
  return response;
}

async function addMovieToWatchlist(movieID) {
  const url = `${process.env.API_URL_V3}/account/${process.env.ACCOUNT_ID}/watchlist?session_id=${process.env.SESSION_ID}`;
  const body = {
    "media_type": "movie",
    "media_id": movieID,
    "watchlist": true
  }
  const request = await fetch(encodeURI(url), {
    method: 'POST',
    hostname: "api.themoviedb.org",
    body: JSON.stringify(body),
    headers: {
      "authorization": process.env.API_ACCESS_TOKEN,
      "content-type": "application/json;charset=utf-8"
    }
  });
  const response = await request.json();
  if (response.success) logger(`Added movie with id ${movieID} to watchlist`, true);
  else logger(`ERROR when adding movie with id ${movieID} to watchlist`, true);
  return response;
}

async function addTVShowToWatchlist(tvID) {
  const url = `${process.env.API_URL_V3}/account/${process.env.ACCOUNT_ID}/watchlist?session_id=${process.env.SESSION_ID}`;
  const body = {
    "media_type": "tv",
    "media_id": tvID,
    "watchlist": true
  }
  const request = await fetch(encodeURI(url), {
    method: 'POST',
    hostname: "api.themoviedb.org",
    body: JSON.stringify(body),
    headers: {
      "authorization": process.env.API_ACCESS_TOKEN,
      "content-type": "application/json;charset=utf-8"
    }
  });
  const response = await request.json();
  if (response.success) logger(`Successfully added movie with id ${tvID} to watchlist`, true);
  else logger(`ERROR when adding TV SHOW with id ${tvID} to watchlist`, true);
  return response;
}

function logger(content, newBlock = false) {
  fs.appendFileSync("log.txt", `${newBlock ? '\n\n\n\n\n' : '\n'}${new Date().toUTCString()} - ${content}`)
}

updateMoviesWatchlist(justwatchData.watchlist.movies).then(res => console.log(`Added ${res.length} movies into watchlist`, res));
updateTVShowsWatchlist(justwatchData.watchlist.tv).then(res => console.log(`Added ${res.length} tv shows into watchlist`, res));
updateMoviesWatchedList(justwatchData.watched.movies, process.env.WATCHED_MOVIES_LIST_ID).then(res => console.log(`Added ${res.length} movies into watched list`, res));
updateTVShowsWatchedList(justwatchData.watched.tv, process.env.WATCHED_TVSHOWS_LIST_ID).then(res => console.log(`Added ${res.length} tv shows into watched list`, res));