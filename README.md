# JustWatch-To-TMDB
*Note: This program was created for personal use, but as I couldn't find a similar solution to this problem I decided to upload it so anyone could use it. Feel free to modify it to your convenience.*

JustWatch-To-TMDB is a software built with NodeJS which helps you to migrate your movies and TV shows from JustWatch to TMDB. JustWatch is a good service, but it doesn't make easy for users to extract their data. This program will need your help in order to accomplish the migration.



## Instructions

1. #### Clone this repo or download the zip file.

2. ####  Extract your data from JustWatch via browser's console.
   As JustWatch uses a tokenization system for accessing data, using web scrappers is much harder than it could be. Because of that, we are going to follow the following steps:
   1. Open your favorite web browser (Google Chrome recommended) and open [JustWatch](https://www.justwatch.com).
   2. Log in.
   3. Access to your [watchlist](https://www.justwatch.com/us/watchlist). There you can access to four different resources, chose one of them: Movies-Watchlist, Movies-Seen, TV Shows-Watch Next and TV Shows-Caught up.
   4. Manually scroll down to the bottom of the page to load all the items.
   5. Wait for all the items to be loaded.
   6. Open the browser's developer tools (in Windows one way to do it is by doing right-click with the mouse and selecting Inspect Element on any element of the website). Then we select the Console tab.
   7. We must paste any of these codes, depending on which resource are we trying to get. 
      *Note: These snippets were working on January/03/2022.*
    ##### Movies watchlist & watched movies.
    ```javascript
    const movies = [...document.querySelectorAll('.title-card')];
    const results = movies.map(movie => {
        let name = movie.querySelector('.title-card-heading').firstChild.textContent.trim();
        let year = movie.querySelector('.title-card-heading__info')?.textContent;
        if (year) year = /\d+/.exec(year)?.[0] ?? undefined;
        let liked = movie.querySelector("div[aria-label='Like'] .title-poster-quick-actions-content__bubbles__item--visible");
        let disliked = movie.querySelector("div[aria-label='Dislike'] .title-poster-quick-actions-content__bubbles__item--visible");
        const rating = liked ? 1 : disliked ? -1 : 0;
        return { name, year, rating };
    });
    console.log(results);
    ```
    ##### TV Shows watchlist.
    ```javascript
    const results = [...document.querySelectorAll('.title-card-show-episode__title-name')].map(tv => {
        return { name: tv.firstChild.textContent.trim(), seen: false }
    });
    console.log(results);
    ```

    ##### Watched TV shows
    ```javascript
    const results = [...document.querySelectorAll('.title-card')].map(tv => {
        return { 
           name: tv.querySelector('.title-card-heading').firstChild.textContent.trim(),
           seen: true }
       });
    console.log(results);
    ```
   8. After the execution of any of these snippets we will do right-click onto the results value and copy it as an object (if your browser does not support this action I strongly recommend you to use another one such as Opera or Chrome). 

    ![](https://raw.githubusercontent.com/arialdev/JustWatch-To-TMDB/main/readme_resources/copy_object.png)
   9. We open the program directory and open the [src/movies.json](https://raw.githubusercontent.com/arialdev/JustWatch-To-TMDB/main/readme_resources/watchlist_options2.png) file with a text editor (I recommend Visual Studio Code, but the one your operative system already includes should work too). There we must upload it by pasting the returning value from our executed snippets. If there are some snippets you didn't need to execute, don't worry, leave that value as it is.
      *Note: remember replacing the empty brackets with the copied value. **Do not paste the data inside the brackets**.*

    ![](https://raw.githubusercontent.com/arialdev/JustWatch-To-TMDB/main/readme_resources/update_json.png)

3. #### Open a terminal and ensure you have an updated version of NodeJS installed. If not, you must [install it](https://nodejs.org/en/download/).

4. #### Open the project's directory with the terminal and execute the following command to install all the dependencies:

   ```shell
   npm i
   ```

   ![](https://raw.githubusercontent.com/arialdev/JustWatch-To-TMDB/main/readme_resources/check_nodejs.png)

5. We are going to use the TMDB API in order to import our data from JustWatch. Because of this, you must request access to the API (at the moment I'm writing this this process is really fast and simple). For doing so you must:

   1. Create and validate an account on [TMDB](https://www.themoviedb.org).
   2. Follow the [documentation instructions](https://developers.themoviedb.org/3/getting-started/introduction) to request access to the API and to request all the necessary tokens and private keys.

6. Go back to the project's directory and create a new file in the root named `.env`. On it you must paste the following data, including your private keys and tokens (read the documentation in order to obtain these). Substitute the `${blablabla} `fields with your personal data.
   
   *Note: this is the trickiest part. Be patient. You can help yourself by using [PostMan](https://www.postman.com) or any HTTP Request client for getting the needed tokens*
   
   ```ini
   API_URL=https://api.themoviedb.org/4
   API_URL_V3=https://api.themoviedb.org/3
   API_TOKEN=Bearer ${YOUR_TOKEN}
   API_ACCESS_TOKEN=Bearer ${YOUR_TOKEN}
   WATCHED_MOVIES_LIST_ID=${THE ID OF THE LIST YOU CREATED FOR YOUR WATCHED MOVIES (you can find it on its url)}
   WATCHED_TVSHOWS_LIST_ID=${THE ID OF THE LIST YOU CREATED FOR YOUR WATCHED MOVIES (you can find it on its url)}
   SESSION_ID=${YOUR_TOKEN}
   ACCOUNT_ID=${YOUR ACCOUNT ID (read the docs in order to know how to obtain it)}
   ```
   
7. Open the project's directory on a terminal and execute 
   ```shell
   npm start
   ```
