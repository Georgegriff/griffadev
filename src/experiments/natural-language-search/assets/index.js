import * as Comlink from "https://unpkg.com/comlink@4.3.0/dist/esm/comlink.min.mjs";

const worker = new Worker(`${import.meta.url.replace("index.js", "worker.js")}`);
// WebWorkers use `postMessage` and therefore work with Comlink.
const Searcher = Comlink.wrap(worker);

// UI
const searchEl = document.querySelector("#search");
const form = document.querySelector("form");
searchEl.disabled = false;
const resultsEl = document.querySelector('#results');

function setLoading(isLoading) {
  const loading = document.querySelector('griff-loader');
  if(isLoading) {
    loading.setAttribute("loading", true)
  } else {
    loading.removeAttribute("loading")
  }
}

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

const loadData = async () => {
  // fetch + cache comparison data
  const res =await fetch("https://griffa.dev/feed/feed.json");
  const feed = (await res.json());
  const data = feed.items.map((item) => {
    return {
      searchData: `${item.title} ${item.summary}`,
      title: item.title,
      description: item.summary,
      link: item.url
    }
  });
  console.log("data loaded")
  return data;
};

const search = async (searchInput, data) => {
  if(!searchInput) {
    return;
  }
  resultsEl.innerHTML = 'Searching posts...';
  setLoading(true)

  const allResults = await Searcher.search([searchInput], data);
  if(!allResults.length) {
    return;
  }
  setLoading(false);
  const results = allResults[0]


  resultsEl.innerHTML = '';
  results.predictions.forEach(({result, similarity}) => {
    const li = document.createElement('li');
    li.classList.add("list-item")
    li.innerHTML = `<div class="results-card">
      <a href="${result.link}" target="_blank" class="results-title">${decodeHtml(result.title)}</a>
      <p>${decodeHtml(result.description)}</p>
      <span>${Math.floor(similarity * 100)}% match</span>
    </div>`
    resultsEl.appendChild(li);
  });
}

const setSearchField = (query) => {
  searchEl.value = query
}

const updateSearchParams = (value) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("q", encodeURIComponent(value));
  history.replaceState(null, null, "?"+ queryParams.toString());
}

const readQueryFromSearchParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get("q");
}

let blogPosts;
searchEl.addEventListener('change', async (e) => {
  const searchInput = e.target.value;
  updateSearchParams(searchInput);
  try {
    await search(searchInput, blogPosts);
  } catch(e) {
    console.error(e)
  }
})

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(!blogPosts) {
    return;
  }
  updateSearchParams(searchEl.value);
  try {
    await search(searchEl.value, blogPosts);
  } catch(e) {
    console.error(e)
  }
})

let query = readQueryFromSearchParams();
// example
if(!query) {
  query = 'How can i create my own blog posts with javascript?'
  updateSearchParams(query);
} 
setSearchField(decodeURIComponent(query));
setLoading(true);

(async ()  => {
  resultsEl.innerHTML = 'Contacting Skynet...';
  [blogPosts] = await Promise.all([loadData(),Searcher.load()]);
  await search(query, blogPosts);
})();




