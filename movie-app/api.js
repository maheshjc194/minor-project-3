const API_KEY = "YOUR_OMDB_API_KEY";
const BASE_URL = "https://www.omdbapi.com/";

async function requestOMDb(params) {
  if (API_KEY === "YOUR_OMDB_API_KEY") {
    throw new Error("Add your OMDb API key in Movie-App/api.js before searching.");
  }

  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({ ...params, apikey: API_KEY });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not connect to the movie service. Please try again.");
  }

  const data = await response.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "No movies found.");
  }
  return data;
}

export async function searchMovies(title) {
  return requestOMDb({ s: title, type: "movie" });
}

export async function getMovieDetails(imdbID) {
  return requestOMDb({ i: imdbID, plot: "full" });
}
