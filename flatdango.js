const list = document.getElementsByTagName("ul")[0];
const titleLabel = document.getElementById("title");
const runTimeLabel = document.getElementById("runTime");
const showTimeLabel = document.getElementById("showTime");
const descLabel = document.getElementsByTagName("p")[0];
const poster = document.getElementsByTagName("img")[0];
const ticketsLabel = document.getElementById("tickets");
const purchaseButton = document.getElementById("purchase");

let selectedMovie = {};

window.addEventListener("load", () => {
  fetchData();
});

purchaseButton.addEventListener("click", () => {
  fetch(`http://localhost:3000/films/${selectedMovie.id}`, {
    method: "PUT",
    headers: new Headers({ "content-type": "application/json" }),
    body: `tickets_sold=${encodeURIComponent(selectedMovie.tickets_sold + 1)}`,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then((data) => {
      console.log(data);
      selectedMovie = data;
      //setMovieDetails();
      //fetchData();
    })
    .catch((err) => {
      console.log(err);
    });
});

function fetchData() {
  fetch("http://localhost:3000/films", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((movie, id) => {
        const listItem = document.createElement("li");

        const isSoldOut = movie.capacity - movie.tickets_sold == 0;
        //Ternary operator
        const className = isSoldOut ? "sold-out list item" : "list item";
        listItem.setAttribute("class", className);

        const numLabel = document.createElement("label");
        numLabel.textContent = id + 1;

        const nameLabel = document.createElement("label");
        nameLabel.textContent = movie.title;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
          deleteMovie(movie.id);
        });

        listItem.append(numLabel);
        listItem.append(nameLabel);
        listItem.append(deleteButton);

        listItem.addEventListener("click", () => {
          selectedMovie = movie;
          setMovieDetails();
        });

        list.append(listItem);
      });
    });
}

function setMovieDetails() {
  const movie = selectedMovie;
  titleLabel.textContent = movie.title;
  runTimeLabel.textContent = movie.runtime;
  showTimeLabel.textContent = movie.showtime;
  descLabel.textContent = movie.description;
  poster.setAttribute("src", movie.poster);
  ticketsLabel.textContent = movie.capacity - movie.tickets_sold;

  if (movie.capacity - movie.tickets_sold == 0) {
    purchaseButton.setAttribute("class", "purchase-disabled");
    purchaseButton.textContent = "Sold Out";
    purchaseButton.setAttribute("diasabled", true);
  } else {
    purchaseButton.setAttribute("class", "purchase");
    purchaseButton.textContent = "Purchase Ticket";
    purchaseButton.setAttribute("diasabled", false);
  }
}

function deleteMovie(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`, {
    method: "DELETE",
    headers: new Headers({ "content-type": "application/json" }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then((data) => {
      console.log(data);
      fetchData();
      alert("Movie Deleted");
    })
    .catch((err) => {
      console.log(err);
    });
}

