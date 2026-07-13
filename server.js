const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/posters", express.static(path.join(__dirname, "posters")));

// Storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "poster") {
            cb(null, "posters");
        } else {
            cb(null, "uploads");
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload route
app.post(
    "/upload",
    upload.fields([
        { name: "poster", maxCount: 1 },
        { name: "movie", maxCount: 1 }
    ]),
   (req, res) => {

    const moviesFile = "movies.json";

    let movies = [];

    if (fs.existsSync(moviesFile)) {
        movies = JSON.parse(fs.readFileSync(moviesFile));
    }

  movies.push({
    title: req.body.title,
    type: req.body.type,
    category: req.body.category,
    year: req.body.year,
    description: req.body.description,

    poster: req.files.poster[0].filename,
    movie: req.files.movie[0].filename
});
    fs.writeFileSync(moviesFile, JSON.stringify(movies, null, 2));

    res.json({
        success: true
    });

}
);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
// Delete movie
app.delete("/delete/:index", (req, res) => {

    const moviesFile = "movies.json";

    if (!fs.existsSync(moviesFile)) {
        return res.json({ success: false });
    }

    let movies = JSON.parse(fs.readFileSync(moviesFile));

    const index = parseInt(req.params.index);

    if (index < 0 || index >= movies.length) {
        return res.json({ success: false });
    }

    const movie = movies[index];

    // Delete poster
    const posterPath = path.join(__dirname, "posters", movie.poster);
    if (fs.existsSync(posterPath)) {
        fs.unlinkSync(posterPath);
    }

    // Delete video
    const moviePath = path.join(__dirname, "uploads", movie.movie);
    if (fs.existsSync(moviePath)) {
        fs.unlinkSync(moviePath);
    }

    // Remove from array
    movies.splice(index, 1);

    // Save movies.json
    fs.writeFileSync(moviesFile, JSON.stringify(movies, null, 2));

    res.json({ success: true });

});
// Get all movies
app.get("/movies", (req, res) => {

    const moviesFile = "movies.json";

    if (!fs.existsSync(moviesFile)) {
        return res.json([]);
    }

    const movies = JSON.parse(fs.readFileSync(moviesFile));

    res.json(movies);

});
app.listen(PORT, () => {
    console.log("KurdBox is running!");
    console.log("Open: http://localhost:3000");
});