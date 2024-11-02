function stringToDOMElement(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  return div.firstChild;
}

function checkItemMatch(item) {
  item.classList.remove("search-match", "search-hide");
  let datapoints = Array.from(
    item.querySelectorAll(".year, .rating, .item-title")
  );
  console.log(item);
  let search_input = document
    .querySelector(".search-input")
    .value.toLowerCase();
  let item_matched = datapoints.some((data) =>
    data.textContent.toLowerCase().includes(search_input)
  );
  if (item_matched) {
    item.classList.add("search-match");
  } else {
    item.classList.add("search-hide");
  }
}

function searchInContainer(container) {
    let container_title = ""
    if (container.hasAttribute("data-container-title")) {
        container_title = container.getAttribute("data-container-title");
    }
    else {
        container_title = container.querySelector('.banner').innerHTML;
        container.setAttribute("data-container-title", container_title);
    }
    
    container.querySelectorAll('.item').forEach(checkItemMatch);
    if (document.querySelector(".search-input").value === "") {
        container.querySelector(`.banner`).textContent = container_title;
      }
    else {
        container.querySelector(`.banner`).textContent = `Found ${
          container.querySelectorAll('.search-match').length
        } results for \"${
          document.querySelector(".search-input").value
        }\" in ${container_title}`;
  }
}

function toggleBookmark(id, button) {
  fetch(`/Media_Site/api-data/${id}/toggle-bookmark/`)
    .then((response) => response.json())
    .then((data) => {
      updateBookmarkButton(button, data.isBookmarked);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation', error);
    })
}

function updateBookmarkButton(button, isBookmarked) {
  if (isBookmarked) {
    button.classList.add("bookmark-active");
  }
  else {
    button.classList.remove("bookmark-active");
  }
}
function createPlayButton() {
  let play_button_container = document.createElement("div");
  play_button_container.classList.add("wrapper", "play-button", "hidden");
  let play_button_icon = document.createElement("div");
  play_button_icon.classList.add("play-icon");
  play_button_container.appendChild(play_button_icon);

  let play_button_text = document.createElement("div");
  play_button_text.classList.add("play-text");
  play_button_text.textContent = "Play";
  play_button_container.appendChild(play_button_text);

  return play_button_container;
}

function createBookmarkButton(id, isBookmarked) {
  let bookmark_container = document.createElement("div");
  bookmark_container.classList.add("bookmark-button");
  if (isBookmarked) {
    bookmark_container.classList.add("bookmark-active");
  }
  bookmark_container.addEventListener("click", () => {
    toggleBookmark(id, bookmark_container);
  } )
  return bookmark_container;
}

function createTileText(year, category, rating, title) {
  let category_map = {
    Movie: "movie",
    "TV Series": "tv",
  };
  let text_container = document.createElement("div");
  text_container.classList.add("tile-text");

  text_container.innerHTML = `<div class="item-data">
            <span class="year">${year}</span>
            <span class="bullet">•</span>
            <img src="${static_url(`assets/icon-category-${category_map[category]}.svg`)}" style="margin: 0.25em;">
            <span class="category">${category}</span>
            <span class="bullet">•</span>
            <span class="rating">${rating}</span>
        </div>
        <div class="item-title">${title}</div>`;
  return text_container;
}

function createMediaTile(item, text_inside) {
  console.log(item)
  let image = item.thumbnail + "regular/large.jpg";
  let tile = document.createElement("div");
  tile.classList.add('item');
  tile.setAttribute('data-media-id', item.id);

  let containerL1A = document.createElement("div");
  containerL1A.classList.add(
    "item-image",
    `item-flex-wrapper`
  );
  containerL1A.style.backgroundImage = `url(${static_url(image)})`;

  containerL1A.appendChild(createPlayButton());
  containerL1A.appendChild(createBookmarkButton(item.id, item.isBookmarked));
  tile.appendChild(containerL1A);

  tile.appendChild(
    createTileText(
      item.year,
      item.category,
      item.rating,
      item.title
    )
  );


  tile.addEventListener("mouseover", () => {
    tile.querySelector(".play-button").classList.remove("hidden");
  });
  tile.addEventListener("mouseout", () => {
    tile.querySelector(".play-button").classList.add("hidden");
  });
  return tile;
}

// Makes a function that, if bookmark button is clicked, and JSONdata[item].isBookmarked == false, then set it to true.

// Hit python CRUD backend with sqlite database
// fetch("website.com/api/get_bookmarks")
// fetch("website.com/api/add_bookmark?movie_id=4523").then(
// if (response.success) {
// change css to indicate bookmarked
// }
// )

// User login: outsource

// Load json file like a crazy person


function static_url(relative_path) {
  return DJANGO_VARS.static_url + relative_path
}

function populatePage() {
  let trendingItems = [];
  let recommendedItems = [];
  let movies = [];
  let shows = [];
  let bookmarkedItems = [];
  fetch('/Media_Site/api-data')
    .then((response) => response.json())
    .then((data) => {
      console.log("Data:", data);
      data.forEach((media) => {
        if (media.isTrending) {
          trendingItems.push(media);
        } else {
          recommendedItems.push(media);
        }
        if (media.category == "Movie") {
          movies.push(media);
        } else {
          shows.push(media);
        }
        if (media.isBookmarked) {
          bookmarkedItems.push(media);
        }
      });
      console.log("Trending:", trendingItems);
      console.log("Recommended:", recommendedItems);
      console.log("Movies:", movies);
      console.log("Shows:", shows);
      console.log("Bookmarked:", bookmarkedItems);
      console.log(window.location.pathname);

      // INDEX //

      if (DJANGO_VARS.view_name=="index") {
        // Populate Trending Items bucket //
        trendingItems.forEach((trendingItem) => {
            let tile = createMediaTile(trendingItem);
            tile.classList.add("trending-item");
            // tile.querySelector(".tile-text").style.margin = "-3.25em 1em";
            // tile.querySelector(".item-title").style.fontSize = "24px";
            // tile.querySelector(".play-button").style.marginLeft = "12em";
            document.querySelector(".trending-bucket").appendChild(tile);
        });

        // Populates Recommended Section

        recommendedItems.forEach((recommendedItem) => {
            let tile = createMediaTile(recommendedItem);
            tile.classList.add("recommended-item");
            document.querySelector(".recommended-bucket").appendChild(tile);
        });

        document
          .querySelector(".search-input")
          .addEventListener("keyup", () => {
            searchInContainer(document.querySelector(".trending-container"));
            searchInContainer(document.querySelector(".recommended-container"));
          });
      }

      // MOVIES //

      else if (DJANGO_VARS.view_name=="movies") {
        movies.forEach((movie) => {
                let tile = createMediaTile(movie);
                tile.classList.add("movie-item");
                document.querySelector(".movies-bucket").appendChild(tile);
        });
          // Adds search input functionality //

        document
          .querySelector(".search-input")
          .addEventListener("keyup", () => {
            searchInContainer(document.querySelector(".movies-container"));
          });
      }

      // TV SERIES //
      else if (DJANGO_VARS.view_name=="tv-series") {
        shows.forEach((show) => {
          let tile = createMediaTile(show);
                tile.classList.add("show-item");
                document.querySelector(".shows-bucket").appendChild(tile);
                
        });
        // Adds search input functionality //

        document
            .querySelector(".search-input")
            .addEventListener("keyup", () => {
                searchInContainer(document.querySelector(".shows-container"));
            });
      }

      // BOOKMARKED //
      else if (DJANGO_VARS.view_name=="bookmarked") {
        bookmarkedItems.forEach((bookmarkedItem) => {
            let tile = createMediaTile(bookmarkedItem);
            if (bookmarkedItem.category == "Movie") {
                tile.classList.add("movie-item");
                document.querySelector(".movies-bucket").appendChild(tile);
            }
            else {
                tile.classList.add("show-item");
                document.querySelector(".shows-bucket").appendChild(tile);
            }
        });

        document
          .querySelector(".search-input")
          .addEventListener("keyup", () => {
            searchInContainer(document.querySelector('.shows-container'))
            searchInContainer(document.querySelector('.movies-container'));
          });
        };
    });
};

function displayButton() {
  console.log(
    "displayButton trending items:",
    document.querySelectorAll(".trending-item")
  );
  document
    .querySelectorAll(".trending-item, .recommended-item")
    .forEach((item) => {
      item.querySelector(".play-button").classList.add("hidden");
      item.addEventListener("mouseover", () => {
        item.querySelector(".play-button").classList.remove("hidden");
      });
      item.addEventListener("mouseout", () => {
        item.querySelector(".play-button").classList.add("hidden");
      });
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
  populatePage();
  displayButton();
});
