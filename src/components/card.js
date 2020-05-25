import React from "react";
import "./card.css";
import Swal from "sweetalert2";

const Card = (props) => {
  console.log(props);
  return (
    <div>
      <div className="card mb-3">
        <div className="row no-gutters">
          <div className="col-md-2">
            <img src={props.data.Poster} className="card-img" alt="..." />
          </div>
          <div className="col-md-10">
            <span class="badge badge-primary imdbratingbadge">
              {props.data.imdbRating}
            </span>
            <div className="card-body cardbodaypad">
              <h5 className="card-title">{props.data.Title}</h5>
              <p className="card-text">{props.data.Plot}</p>
              <small className="text-muted textfeilds ">
                Genre : {props.data.Genre}
              </small>{" "}
              <br />
              <small className="text-muted textfeilds ">
                {props.data.Year}
              </small>
              <br />
              <small className="text-muted textfeilds ">
                Main cast : {props.data.Actors}
              </small>{" "}
              <br />
              <small className="text-muted textfeilds ">
                Directed by : {props.data.Director}
              </small>{" "}
              <br />{" "}
              {/* <small className="text-muted textfeilds ">
                Language : {props.data.Language}
              </small>{" "} */}
            </div>{" "}
            <button
              // disabled={this.state.imdbcode.length > 0 ? false : true}
              className="btn btn-danger imdbatag "
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, Remove this movie!",
                }).then((result) => {
                  if (result.value) {
                    // this.setState({ imdbcode: [], movies: [] });
                    props.removemovieaction(props.data.imdbID);
                    Swal.fire(
                      "Donezo !",
                      "That wont't bother you anymore 😉",
                      "success"
                    );
                  }
                });
              }}
            >
              Remove
            </button>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`https://www.imdb.com/title/${props.data.imdbID}`}
              class="btn btn-primary imdbatag"
            >
              IMDB
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;

/*
Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy"
Awards: "Won 4 Oscars. Another 152 wins & 217 nominations."
BoxOffice: "$292,568,851"
Country: "USA, UK"
DVD: "07 Dec 2010"
Director: "Christopher Nolan"
Genre: "Action, Adventure, Sci-Fi, Thriller"
Language: "English, Japanese, French"
Metascore: "74"
Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
Production: "Warner Bros. Pictures"
Rated: "PG-13"
Ratings: (3) [{…}, {…}, {…}]
Released: "16 Jul 2010"
Response: "True"
Runtime: "148 min"
Title: "Inception"
Type: "movie"
Website: "N/A"
Writer: "Christopher Nolan"
Year: "2010"
imdbID: "tt1375666"
imdbRating: "8.8"
imdbVotes: "1,934,808"
*/
