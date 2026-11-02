import { searchMovies, getMovieDetails } from "./api.js";

const form = document.querySelector("#movie-form");
const input = document.querySelector("#movie-input");
const statusText = document.querySelector("#status");
const results = document.querySelector("#movie-results");
const resultCount = document.querySelector("#result-count");
const resultsTitle = document.querySelector("#results-title");
const dialog = document.querySelector("#movie-dialog");
const movieDetails = document.querySelector("#movie-details");

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[char]));

function posterMarkup(movie) {
  const validPoster = movie.Poster && movie.Poster !== "N/A";
  return validPoster
    ? `<img class="poster" src="${escapeHTML(movie.Poster)}" alt="Poster for ${escapeHTML(movie.Title)}" loading="lazy">`
    : `<div class="poster poster-placeholder">No poster available</div>`;
}

function renderMovies(movies) {
  results.innerHTML = movies.map(movie => `
    <article class="movie-card" data-id="${escapeHTML(movie.imdbID)}" tabindex="0" role="button"
      aria-label="View details for ${escapeHTML(movie.Title)}">
      ${posterMarkup(movie)}
      <div class="movie-info">
        <h3 title="${escapeHTML(movie.Title)}">${escapeHTML(movie.Title)}</h3>
        <div class="movie-meta"><span>${escapeHTML(movie.Year)}</span><span>🎬 Movie</span></div>
      </div>
    </article>
  `).join("");
  resultCount.textContent = `${movies.length} result(s)`;
}

async function openMovieDetails(imdbID) {
  statusText.textContent = "Loading movie details...";
  try {
    const movie = await getMovieDetails(imdbID);
    const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";
    movieDetails.innerHTML = `
      <div class="detail-layout">
        ${poster ? `<img class="detail-poster" src="${escapeHTML(poster)}" alt="Poster for ${escapeHTML(movie.Title)}">` : `<div class="detail-poster poster-placeholder">No poster</div>`}
        <div class="detail-copy">
          <h2>${escapeHTML(movie.Title)}</h2>
          <p class="detail-line">${escapeHTML(movie.Year)} · ${escapeHTML(movie.Runtime)} · ${escapeHTML(movie.Rated)}</p>
          <p><strong>⭐ IMDb rating:</strong> ${escapeHTML(movie.imdbRating || "Not available")}</p>
          <p><strong>Released:</strong> ${escapeHTML(movie.Released || "Not available")}</p>
          <p><strong>Genre:</strong> ${escapeHTML(movie.Genre || "Not available")}</p>
          <p><strong>Director:</strong> ${escapeHTML(movie.Director || "Not available")}</p>
          <p>${escapeHTML(movie.Plot || "No plot summary available.")}</p>
        </div>
      </div>
    `;
    dialog.showModal();
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    statusText.textContent = "Please enter a movie title.";
    return;
  }

  statusText.textContent = "Searching movies...";
  results.innerHTML = "";
  resultCount.textContent = "";
  resultsTitle.textContent = `Results for "${title}"`;

  try {
    const data = await searchMovies(title);
    // Destructuring reads the search list from the JSON response.
    const { Search: movies } = data;
    renderMovies(movies);
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message || "Something went wrong.";
    results.innerHTML = "";
    resultCount.textContent = "0 results";
  }
});

results.addEventListener("click", (event) => {
  const card = event.target.closest(".movie-card");
  if (card) openMovieDetails(card.dataset.id);
});