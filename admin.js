document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append("type", document.getElementById("type").value);
        formData.append("category", document.getElementById("category").value);
        formData.append("year", document.getElementById("year").value);
        formData.append("description", document.getElementById("description").value);

        formData.append("poster", document.getElementById("poster").files[0]);
        formData.append("movie", document.getElementById("movie").files[0]);

        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        console.log(result);

        if (result.success) {
            alert("Movie uploaded successfully!");
            location.reload();
        } else {
            alert("Upload failed!");
        }

    } catch (err) {
        console.error(err);
        alert("ERROR:\n\n" + err.message);
    }

});
// =========================
// Load uploaded movies
// =========================

async function loadMovies() {

    const movieList = document.getElementById("movieList");

    movieList.innerHTML = "";

    const response = await fetch("/movies");

    const movies = await response.json();

    movies.forEach((movie, index) => {

        const div = document.createElement("div");

        div.className = "admin-movie";

        div.innerHTML = `
            <img src="/posters/${movie.poster}" width="80">

            <div>
                <h3>${movie.title}</h3>
                <p>${movie.type} • ${movie.year}</p>
            </div>

            <button class="delete-btn" data-index="${index}">
                🗑 Delete
            </button>
        `;

        movieList.appendChild(div);

    });

}

loadMovies();
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-btn")) return;

    const index = e.target.dataset.index;

    const ok = confirm("Are you sure you want to delete this movie?");

    if (!ok) return;

    const response = await fetch("/delete/" + index, {
        method: "DELETE"
    });

    const result = await response.json();

    if (result.success) {
        alert("Movie deleted successfully!");
        loadMovies();
    } else {
        alert("Delete failed!");
    }

});