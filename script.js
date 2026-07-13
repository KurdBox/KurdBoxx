/* =====================================
   KurdBox | کوردبۆکس
   script.js
   Version 1.0
===================================== */

console.log("KurdBox Started");

/* ===========================
CURRENT YEAR
=========================== */

const year = new Date().getFullYear();

const copyright = document.querySelector(".copyright");

if(copyright){

copyright.innerHTML =
`© ${year} KurdBox | کوردبۆکس`;

}

/* ===========================
LOGIN POPUP
=========================== */

const modal =
document.getElementById("loginModal");

const closeBtn =
document.querySelector(".close");

const profile =
document.querySelector(".profile");

if(profile){

profile.onclick=function(){

modal.style.display="block";

}

}

if(closeBtn){

closeBtn.onclick=function(){

modal.style.display="none";

}

}

window.onclick=function(e){

if(e.target==modal){

modal.style.display="none";

}

}

/* ===========================
SEARCH
=========================== */

const searchInput =
document.getElementById("search");

const cards =
document.querySelectorAll(".movie-card");

if(searchInput){

searchInput.addEventListener("keyup",function(){

const value=
this.value.toLowerCase();

cards.forEach(card=>{

const title=
card.innerText.toLowerCase();

if(title.indexOf(value)>-1){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

}
/*
==========================
GENRE FILTER
==========================
*/

const genreFilter = document.getElementById("genreFilter");

if (genreFilter) {
    genreFilter.addEventListener("change", function () {

        const value = this.value.toLowerCase();

        cards.forEach(card => {

            if (value === "all") {
                card.style.display = "block";
            } else {
                const genre = card.dataset.genre;

                if (genre === value) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            }

        });

    });
}

/* ===========================
MOVIE HOVER
=========================== */

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.zIndex="50";

});

card.addEventListener("mouseleave",()=>{

card.style.zIndex="1";

});

});

/* ===========================
SMOOTH SCROLL
=========================== */

document.querySelectorAll("a").forEach(link=>{

link.addEventListener("click",function(e){

if(this.getAttribute("href")=="#"){

e.preventDefault();

window.scrollTo({

top:0,

behavior:"smooth"

});

}

});

});

/* ===========================
WELCOME
=========================== */

setTimeout(()=>{

console.log("Welcome to KurdBox");

},1000);
/* =====================================
   KURDBOX FAVORITES (My List)
===================================== */

let favorites = JSON.parse(localStorage.getItem("kurdboxFavorites")) || [];

function saveFavorites() {
    localStorage.setItem("kurdboxFavorites", JSON.stringify(favorites));
}

document.querySelectorAll(".movie-card").forEach((card, index) => {

    // Create favorite button
    const favBtn = document.createElement("button");
    favBtn.innerHTML = "❤";
    favBtn.className = "favorite-btn";

    card.appendChild(favBtn);

    favBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        if (favorites.includes(index)) {

            favorites = favorites.filter(item => item !== index);

            favBtn.classList.remove("active");

        } else {

            favorites.push(index);

            favBtn.classList.add("active");

        }

        saveFavorites();

    });

    if (favorites.includes(index)) {
        favBtn.classList.add("active");
    }

});

// ===============================
// Load uploaded movies
// ===============================

async function loadUploadedMovies() {

    const moviesSlider = document.getElementById("movies-slider");
    const seriesSlider = document.getElementById("series-slider");
    const animeSlider = document.getElementById("anime-slider");
    const trendingSlider = document.getElementById("trending-slider");

    try {

        const response = await fetch("movies.json");
        const movies = await response.json();

        if (moviesSlider) moviesSlider.innerHTML = "";
        if (seriesSlider) seriesSlider.innerHTML = "";
        if (animeSlider) animeSlider.innerHTML = "";
        if (trendingSlider) trendingSlider.innerHTML = "";

        movies.forEach(movie => {

            const card = document.createElement("div");
            card.className = "movie-card";
			card.dataset.type = (movie.type || "").toLowerCase();

            card.innerHTML = `
                <img src="posters/${movie.poster}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <span>${movie.year || ""}</span>
                </div>
            `;

            card.onclick = () => {
                window.location.href =
                    "watch.html?movie=" + encodeURIComponent(movie.movie);
            };

            // Show in Trending
            if (trendingSlider) {
   const trendingCard = card.cloneNode(true);

trendingCard.onclick = () => {
    window.location.href =
        "watch.html?movie=" + encodeURIComponent(movie.movie);
};

trendingSlider.appendChild(trendingCard);
            }

            // Show in the correct section
            switch ((movie.type || "").toLowerCase()) {

                case "movie":
                    if (moviesSlider) moviesSlider.appendChild(card);
                    break;

                case "series":
                    if (seriesSlider) seriesSlider.appendChild(card);
                    break;

                case "anime":
                    if (animeSlider) animeSlider.appendChild(card);
                    break;

                default:
                    if (moviesSlider) moviesSlider.appendChild(card);
            }

        });

    } catch (err) {
        console.error(err);
    }

}

loadUploadedMovies();
/* ===========================
HAMBURGER MENU
=========================== */

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");
const menuOverlay = document.getElementById("menuOverlay");

menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("active");
    menuOverlay.classList.add("active");
});

closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
});

menuOverlay.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
});
document.querySelectorAll(".side-menu a").forEach(link => {

    link.addEventListener("click", () => {

        sideMenu.classList.remove("active");
        menuOverlay.classList.remove("active");

    });

});
// Hamburger menu filters

document.querySelectorAll('a[href="#movies"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelectorAll(".movie-card").forEach(card => {
            card.style.display =
                card.dataset.type === "movie" ? "block" : "none";
        });
    });
});

document.querySelectorAll('a[href="#series"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelectorAll(".movie-card").forEach(card => {
            card.style.display =
                card.dataset.type === "series" ? "block" : "none";
        });
    });
});

document.querySelectorAll('a[href="#anime"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelectorAll(".movie-card").forEach(card => {
            card.style.display =
                card.dataset.type === "anime" ? "block" : "none";
        });
    });
});

document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelectorAll(".movie-card").forEach(card => {
            card.style.display = "block";
        });
    });
});