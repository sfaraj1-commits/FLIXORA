/* ==========================================================================
   FLIXORA — TMDB API Integration Layer
   ========================================================================== */

const TMDB_CONFIG = {
    API_KEY: "3fd2be6f0c70a2a598f084dd27304861", // مفتاح تجريبي للربط
    BASE_URL: "https://api.themoviedb.org/3",
    IMAGE_BASE: "https://image.tmdb.org/tScales/p/w500",
    LANG: "ar-SA"
};

/* جلب الأفلام الأكثر شعبية */
async function fetchTrendingMovies() {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/trending/movie/week?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}`);
        const data = await response.json();
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            rating: movie.vote_average.toFixed(1),
            poster: movie.poster_path ? `${TMDB_CONFIG.IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750',
            description: movie.overview,
            releaseDate: movie.release_date,
            matchRate: Math.floor(movie.vote_average * 10) + "% ملائم لك"
        }));
    } catch (error) {
        console.error("TMDB Fetch Error:", error);
        return [];
    }
}

/* جلب رابط الإعلان الترويجي (Trailer) */
async function fetchMovieTrailer(movieId) {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`);
        const data = await response.json();
        const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1` : null;
    } catch (error) {
        return null;
    }
}