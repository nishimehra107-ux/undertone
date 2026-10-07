// ==========================================
// LOCAL SONG LIST
// ==========================================

const songs = [

    {
        name: "All the Stars",
        artist: "Kendrick Lamar, SZA",
        file: "Kendrick Lamar, SZA - All The Stars (Lyrics).mp3",
        cover: "cover.jpg",
        duration: "03:50"
    },

    {
        name: "Reflections",
        artist: "The Neighbourhood",
        file: "Reflections.mp3",
        cover: "reflectionscover.png",
        duration: "04:05"
    },

    {
        name: "Those Eyes",
        artist: "New West",
        file: "New West - Those Eyes (Lyrics).mp3",
        cover: "thoseeyescover.jpg",
        duration: "03:42"
    },
    {
        name: "Confident",
        artist: "Justin Bieber",
        file: "Confident.mp3",
        cover: "confideentcover.jpg",
        duration: "04:08"
    }

];


// ==========================================
// JIOSAAVN API
// ==========================================

const API_BASE_URL =
    "https://jiosaavnapi-six.vercel.app";

const API_ENDPOINT =
    "/api/search";


// ==========================================
// AUDIO
// ==========================================

let audioElement = new Audio();

let currentSong = 0;


// ==========================================
// CACHE
// ==========================================

const searchCache = new Map();


// ==========================================
// GET HTML ELEMENTS
// ==========================================

let masterPlay =
    document.getElementById("masterPlay");

let myProgressBar =
    document.getElementById("myProgressBar");

let masterSongName =
    document.getElementById("masterSongName");

let masterSongCover =
    document.getElementById("masterSongCover");

let masterArtist =
    document.getElementById("masterArtist");

let previous =
    document.getElementById("previous");

let next =
    document.getElementById("next");

let songList =
    document.getElementById("songList");


// ==========================================
// CREATE LOCAL SONG CARDS
// ==========================================

songs.forEach((song, index) => {

    let songItem =
        document.createElement("div");

    songItem.classList.add("songItem");

    songItem.innerHTML = `

        <img 
            src="${song.cover}" 
            alt="${song.name}"
        >

        <div class="songDetails">

            <span class="songName">
                ${song.name}
            </span>

            <span class="artist">
                ${song.artist}
            </span>

        </div>

        <div class="songListPlay">

            <span class="timestamp">

                ${song.duration}

                <i
                    class="fa-solid fa-circle-play songItemPlay"
                    data-index="${index}"
                ></i>

            </span>

        </div>

    `;

    songList.appendChild(songItem);

});


// ==========================================
// LOAD SONG
// ==========================================

function loadSong(index) {

    currentSong = index;

    audioElement.src =
        songs[index].file;

    masterSongName.innerText =
        songs[index].name;

    masterSongCover.src =
        songs[index].cover;

    masterArtist.innerText =
        songs[index].artist;

    myProgressBar.value = 0;

}


// ==========================================
// PLAY SONG
// ==========================================

function playSong() {

    audioElement.play();

    masterPlay.classList.remove(
        "fa-circle-play"
    );

    masterPlay.classList.add(
        "fa-circle-pause"
    );

}


// ==========================================
// PAUSE SONG
// ==========================================

function pauseSong() {

    audioElement.pause();

    masterPlay.classList.remove(
        "fa-circle-pause"
    );

    masterPlay.classList.add(
        "fa-circle-play"
    );

}


// ==========================================
// MAIN PLAY BUTTON
// ==========================================

masterPlay.addEventListener("click", () => {

    if (audioElement.paused) {

        playSong();

    } else {

        pauseSong();

    }

});


// ==========================================
// SONG CARD PLAY BUTTON
// ==========================================

document.addEventListener("click", (event) => {

    if (
        event.target.classList.contains(
            "songItemPlay"
        )
    ) {

        let index =
            event.target.getAttribute(
                "data-index"
            );

        loadSong(index);

        playSong();

    }

});


// ==========================================
// UPDATE PROGRESS BAR
// ==========================================

audioElement.addEventListener(
    "timeupdate",
    () => {

        if (
            !isNaN(audioElement.duration)
        ) {

            let progress =
                (
                    audioElement.currentTime /
                    audioElement.duration
                ) * 100;

            myProgressBar.value =
                progress;

        }

    }
);


// ==========================================
// CHANGE SONG POSITION
// ==========================================

myProgressBar.addEventListener(
    "change",
    () => {

        if (!isNaN(audioElement.duration)) {

            audioElement.currentTime =
                (
                    myProgressBar.value *
                    audioElement.duration
                ) / 100;

        }

    }
);


// ==========================================
// NEXT SONG
// ==========================================

next.addEventListener("click", () => {

    currentSong++;

    if (
        currentSong >= songs.length
    ) {

        currentSong = 0;

    }

    loadSong(currentSong);

    playSong();

});


// ==========================================
// PREVIOUS SONG
// ==========================================

previous.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {

        currentSong =
            songs.length - 1;

    }

    loadSong(currentSong);

    playSong();

});


// ==========================================
// AUTOMATICALLY PLAY NEXT SONG
// ==========================================

audioElement.addEventListener(
    "ended",
    () => {

        currentSong++;

        if (
            currentSong >= songs.length
        ) {

            currentSong = 0;

        }

        loadSong(currentSong);

        playSong();

    }
);


// ==========================================
// JIOSAAVN SEARCH UI
// ==========================================

function createSearchUI() {

    const searchSection =
        document.createElement("div");

    searchSection.id =
        "apiSearchSection";

    searchSection.innerHTML = `

        <div class="apiSearchBox">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="apiSearchInput"
                placeholder="Search songs, artists, albums..."
                autocomplete="off"
            >

        </div>

        <div
            id="searchStatus"
            class="searchStatus"
        ></div>

        <div
            id="searchResults"
            class="searchResults"
        ></div>

    `;


    /*
        Put search section before
        the existing local song list
    */

    songList.parentNode.insertBefore(
        searchSection,
        songList
    );


    addSearchStyles();

}


// ==========================================
// SEARCH STYLES
// ==========================================

function addSearchStyles() {

    const style =
        document.createElement("style");

    style.innerHTML = `

        #apiSearchSection {
            margin-bottom: 30px;
        }

        .apiSearchBox {
            width: 100%;
            height: 48px;

            display: flex;
            align-items: center;

            gap: 12px;

            padding: 0 18px;

            border-radius: 25px;

            background: rgba(255,255,255,0.07);

            border:
                1px solid
                rgba(255,255,255,0.08);

            transition: 0.3s ease;
        }

        .apiSearchBox:focus-within {

            border-color:
                rgba(29,215,96,0.5);

            box-shadow:
                0 0 20px
                rgba(29,215,96,0.12);
        }

        .apiSearchBox i {

            color: #a7a7a7;
        }

        #apiSearchInput {

            width: 100%;

            border: none;

            outline: none;

            background: transparent;

            color: white;

            font-size: 14px;
        }

        #apiSearchInput::placeholder {

            color: #777;
        }

        .searchStatus {

            color: #a7a7a7;

            font-size: 12px;

            margin: 12px 5px;
        }

        .searchCategory {

            margin-top: 20px;

            margin-bottom: 10px;

            color: #1ed760;

            font-size: 13px;

            font-weight: bold;

            text-transform: uppercase;

            letter-spacing: 1px;
        }

        .searchResult {

            display: flex;

            align-items: center;

            gap: 14px;

            padding: 10px;

            margin: 8px 0;

            border-radius: 10px;

            background:
                rgba(255,255,255,0.04);

            transition: 0.25s ease;
        }

        .searchResult:hover {

            background:
                rgba(29,215,96,0.09);

            transform:
                translateX(3px);
        }

        .searchResult img {

            width: 55px;

            height: 55px;

            object-fit: cover;

            border-radius: 8px;
        }

        .searchResultInfo {

            flex: 1;

            min-width: 0;
        }

        .searchResultTitle {

            display: block;

            color: white;

            font-size: 14px;

            font-weight: 600;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;
        }

        .searchResultDescription {

            display: block;

            margin-top: 5px;

            color: #999;

            font-size: 12px;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;
        }

        .searchResult a {

            color: #1ed760;

            text-decoration: none;

            font-size: 12px;

            white-space: nowrap;
        }

        .searchResult a:hover {

            text-decoration: underline;
        }

        @media (max-width: 700px) {

            .searchResult a {
                display: none;
            }

            .searchResult img {
                width: 48px;
                height: 48px;
            }

        }

    `;

    document.head.appendChild(style);

}


// ==========================================
// GET BEST IMAGE
// ==========================================

function getImage(result) {

    if (!result.image) {

        return "cover.jpg";

    }


    /*
        API normally returns:

        image: [
            {
                quality: "...",
                url: "..."
            }
        ]
    */

    if (Array.isArray(result.image)) {

        const images =
            result.image;

        /*
            Use the highest quality /
            last available image
        */

        const bestImage =
            images[images.length - 1];

        if (
            bestImage &&
            bestImage.url
        ) {

            return bestImage.url;

        }

    }


    /*
        Fallback if API returns
        image as a simple string
    */

    if (
        typeof result.image === "string"
    ) {

        return result.image;

    }


    return "cover.jpg";

}


// ==========================================
// GET DESCRIPTION
// ==========================================

function getDescription(result) {

    if (result.description) {

        return result.description;

    }

    if (result.primaryArtists) {

        return result.primaryArtists;

    }

    if (result.artist) {

        return result.artist;

    }

    if (result.type) {

        return result.type;

    }

    return "JioSaavn result";

}


// ==========================================
// API REQUEST WITH RETRIES
// ==========================================

async function fetchWithRetry(
    url,
    retries = 2
) {

    for (
        let attempt = 0;
        attempt <= retries;
        attempt++
    ) {

        try {

            const response =
                await fetch(url);

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            return await response.json();

        }

        catch (error) {

            if (
                attempt === retries
            ) {

                throw error;

            }


            /*
                Wait longer after each
                failed request
            */

            const delay =
                500 * (attempt + 1);

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        delay
                    )
            );

        }

    }

}


// ==========================================
// SEARCH JIOSAAVN
// ==========================================

async function searchJioSaavn(query) {

    const cleanQuery =
        query.trim().toLowerCase();


    if (!cleanQuery) {

        return null;

    }


    /*
        Check cache first
    */

    if (
        searchCache.has(cleanQuery)
    ) {

        return searchCache.get(
            cleanQuery
        );

    }


    const url =
        `${API_BASE_URL}${API_ENDPOINT}?query=${encodeURIComponent(cleanQuery)}`;


    const result =
        await fetchWithRetry(url);


    if (
        !result ||
        result.success === false
    ) {

        throw new Error(
            "Search failed"
        );

    }


    /*
        Save result in cache
    */

    searchCache.set(
        cleanQuery,
        result
    );


    return result;

}


// ==========================================
// RENDER SEARCH RESULTS
// ==========================================

function renderSearchResults(apiResult) {

    const resultsContainer =
        document.getElementById(
            "searchResults"
        );


    resultsContainer.innerHTML = "";


    if (
        !apiResult ||
        !apiResult.data
    ) {

        return;

    }


    const data =
        apiResult.data;


    /*
        SONGS
    */

    renderCategory(
        "Songs",
        data.songs?.results || [],
        resultsContainer
    );


    /*
        ALBUMS
    */

    renderCategory(
        "Albums",
        data.albums?.results || [],
        resultsContainer
    );


    /*
        ARTISTS
    */

    renderCategory(
        "Artists",
        data.artists?.results || [],
        resultsContainer
    );


    /*
        PLAYLISTS
    */

    renderCategory(
        "Playlists",
        data.playlists?.results || [],
        resultsContainer
    );


    /*
        TOP QUERY
    */

    renderCategory(
        "Top Results",
        data.topQuery?.results || [],
        resultsContainer
    );


    if (
        resultsContainer.innerHTML === ""
    ) {

        resultsContainer.innerHTML = `

            <p class="searchStatus">
                No results found.
            </p>

        `;

    }

}


// ==========================================
// RENDER CATEGORY
// ==========================================

function renderCategory(
    categoryName,
    results,
    container
) {

    if (
        !results ||
        results.length === 0
    ) {

        return;

    }


    const heading =
        document.createElement("div");

    heading.className =
        "searchCategory";

    heading.innerText =
        categoryName;

    container.appendChild(
        heading
    );


    /*
        Limit results so the UI
        doesn't become enormous
    */

    results
        .slice(0, 5)
        .forEach(result => {

            const item =
                document.createElement("div");

            item.className =
                "searchResult";


            const image =
                getImage(result);


            const title =
                result.title ||
                result.name ||
                "Untitled";


            const description =
                getDescription(result);


            const resultUrl =
                result.url ||
                "#";


            item.innerHTML = `

                <img
                    src="${image}"
                    alt="${title}"
                >

                <div
                    class="searchResultInfo"
                >

                    <span
                        class="searchResultTitle"
                    >
                        ${escapeHTML(title)}
                    </span>

                    <span
                        class="searchResultDescription"
                    >
                        ${escapeHTML(description)}
                    </span>

                </div>

                ${
                    result.url
                    ?
                    `
                    <a
                        href="${resultUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open
                    </a>
                    `
                    :
                    ""
                }

            `;


            container.appendChild(item);

        });

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// DEBOUNCE
// ==========================================

function debounce(
    functionToCall,
    delay
) {

    let timer;

    return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(
            () => {

                functionToCall.apply(
                    this,
                    args
                );

            },
            delay
        );

    };

}


// ==========================================
// HANDLE SEARCH
// ==========================================

async function handleSearch(query) {

    const status =
        document.getElementById(
            "searchStatus"
        );

    const results =
        document.getElementById(
            "searchResults"
        );


    if (
        !query.trim()
    ) {

        status.innerText = "";

        results.innerHTML = "";

        return;

    }


    status.innerText =
        "Searching...";


    try {

        const apiResult =
            await searchJioSaavn(
                query
            );


        renderSearchResults(
            apiResult
        );


        status.innerText =
            `Results for "${query}"`;

    }

    catch (error) {

        console.error(
            "JioSaavn API Error:",
            error
        );


        status.innerText =
            "Something went wrong. Please try again.";

    }

}


// ==========================================
// INITIALIZE SEARCH
// ==========================================

createSearchUI();


const apiSearchInput =
    document.getElementById(
        "apiSearchInput"
    );


const debouncedSearch =
    debounce(
        handleSearch,
        500
    );


apiSearchInput.addEventListener(
    "input",
    (event) => {

        debouncedSearch(
            event.target.value
        );

    }
);


// ==========================================
// LOAD FIRST SONG
// ==========================================

loadSong(0);