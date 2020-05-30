import React from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
// import jwt from "jsonwebtoken";
import _ from "lodash";
import "./landing.css";
import Card from "../../components/card";
// import Swal from "sweetalert2";
import Axios from "axios";
// import Swal from "sweetalert2";

const api = "https://imdbmovieapp-e7c00.web.app/";

const API = "http://localhost:9000";

// const API = "https://movieshare.netlify.app/.netlify/functions";

// const API = 'http://localhost:9000/getmovielist'

const MenuList = (props) => {
  // console.log(props);
  return (
    <components.MenuList {...props}>
      {/* {console.log(props.options)} */}
      {props.options.length !== 0 ? (
        props.options.map((ele) => {
          return (
            <div
              className="cusotmemenu"
              onClick={(e) => {
                // console.log(ele.value);

                props.selectProps.onChange({
                  label: ele.label,
                  value: ele.value,
                  year: ele.year,
                  type: ele.type,
                  poster: ele.poster,
                });
              }}
            >
              <p className="customemenuitem1">{ele.label}</p>
              <p className="customemenuitem2">{ele.year}</p>
              <p className="customemenuitem3">{ele.type}</p>
              {ele.label !== "Movie not found" ? (
                <img
                  src={ele.poster}
                  alt="poster-img"
                  className="customemenuitem4"
                />
              ) : null}
            </div>
          );
        })
      ) : (
        <div className="cusotmemenu" onClick={(e) => {}}>
          <p className="customemenuitem1">Type a movie</p>
        </div>
      )}
    </components.MenuList>
  );
};

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: [{ label: "Lets find some movies.....", value: 1 }],
      defaultValue: { label: "Movie  found", value: 1 },
      movies: [],
      open: false,
      loadfromurl: false,
      // urldata: [],
      imdbcode: [],
      urlmoviedata: [],
      sharername: "",
    };
    this.getOptions = _.debounce(this.getOptions.bind(this), 500);
  }

  componentDidMount() {
    const token = localStorage.getItem("jwt");

    const config = {
      headers: { Authorization: token },
    };

    // console.log(config);

    Axios.get(`${API}/getmovielist`, config)
      .then((result) => {
        console.log(result.data);

        result.data.data.forEach((element) => {
          // console.log(element.fields);

          var temp = {
            id: element.id,
            Poster: element.fields.poster[0].url,
            imdbRating: element.fields.imdbrating,
            Title: element.fields.Name,
            Plot: element.fields.plot,
            Genre: element.fields.genre,
            Year: element.fields.year,
            Actors: element.fields.main_cast,
            Director: element.fields.Directed_by,
            imdbID: element.fields.imdb_link,
          };

          this.setState((pre) => {
            return {
              movies: [temp, ...pre.movies],
            };
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (selectedOption) => {
    console.log(selectedOption);

    this.setState({
      selectedOption: [{ label: "", value: 1 }],
      open: false,
    });
    // // this.setState({});
    // console.log(selectedOption);

    var dups = true;

    for (let index = 0; index < this.state.movies.length; index++) {
      const element = this.state.movies[index];

      var eleid = element.imdbID.split("/").slice(-1)[0];

      console.log("ele id *******************************");
      console.log(eleid);
      console.log(selectedOption.value);
      if (eleid === selectedOption.value) {
        console.log("duplicates");
        dups = false;
        break;
      }
    }

    if (dups) {
      fetch(
        `https://www.omdbapi.com/?i=${selectedOption.value}&apikey=4c3b0a9a`
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);

          const token = localStorage.getItem("jwt");

          const config = {
            headers: { Authorization: token },
          };

          var payload = {
            Directed_by: data.Director,
            Name: data.Title,
            genre: data.Genre,
            imdb_link: `https://www.imdb.com/title/${data.imdbID}`,
            imdbrating: data.imdbRating,
            main_cast: data.Actors,
            plot: data.Plot,
            poster: [{ url: data.Poster }],
            type: data.Type,
            year: data.Year,
            language: data.Language,
            runtime: data.Runtime,
            country: data.Country,
          };

          Axios.post(`${API}/addnewmovie`, payload, config)
            .then((result) => {
              console.log("new movie ****************************************");
              console.log(result.data);

              var temp = {
                id: result.data.data[0].id,
                Poster: result.data.data[0].fields.poster[0].url,
                imdbRating: result.data.data[0].fields.imdbrating,
                Title: result.data.data[0].fields.Name,
                Plot: result.data.data[0].fields.plot,
                Genre: result.data.data[0].fields.genre,
                Year: result.data.data[0].fields.year,
                Actors: result.data.data[0].fields.main_cast,
                Director: result.data.data[0].fields.Directed_by,
                imdbID: result.data.data[0].fields.imdb_link,
              };

              this.setState((pre) => {
                return {
                  movies: [temp, ...pre.movies],
                };
              });

              // this.setState({

              //   imdbcode: [selectedOption.value, ...this.state.imdbcode],
              //   selectedOption: [{ label: "", value: 1 }],
              // });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  };

  getOptions = (inputValue, callback) => {
    this.setState({ open: true });
    // console.log("inputs - - " + inputValue);
    if (!inputValue) {
      return callback([{ label: "Nothing........", value: 1 }]);
    }

    fetch(`https://www.omdbapi.com/?s=${inputValue}&apikey=4c3b0a9a`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        var payload = [];

        if (data.Response !== "False") {
          data.Search.forEach((element) => {
            var temp = {
              label: element.Title,
              year: element.Year,
              type: element.Type,
              value: element.imdbID,
              poster: element.Poster,
            };
            payload.push(temp);
          });
        } else {
          payload = [{ label: "Movie not found", value: 1 }];
          // setsearchres({ label: "Err", value: 1 });
        }
        //   setsearchres(new Promise((res2) => res2(payload)));
        // console.log("resolve");
        // console.log(payload);
        callback(payload);
      })
      .catch((err) => console.log(err));
  };

  removemovie = (imdbid) => {
    console.log(imdbid);

    const token = localStorage.getItem("jwt");

    const config = {
      headers: { Authorization: token },
    };

    var payload = {
      id: imdbid,
    };

    Axios.post(`${API}/removemovie`, payload, config)
      .then((result) => {
        console.log(result.data);

        if (result.data.data.deleted) {
          console.log("de;eted ");

          var mpped = this.state.movies.map((ele) => ele.id);

          console.log(mpped);

          var itemindex = mpped.indexOf(imdbid);
          console.log(itemindex);
          this.setState((pre) => {
            var newmoveis = [...pre.movies];
            newmoveis.splice(itemindex, 1);

            return {
              movies: newmoveis,
            };
          });

          // Swal
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    // const { defaultOptions, placeholder, inputId } = this.props;
    return (
      <>
        <nav class="navbar navbar-light bg-light">
          <a class="navbar-brand" href={api}>
            MovieShare
            <img
              src="https://img.icons8.com/nolan/32/movie-projector.png"
              alt="logo"
            />
          </a>

          <a
            class="btn  my-2 my-sm-0 giticon"
            href="https://github.com/RizkyRajitha/movieshare"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.icons8.com/ios-filled/32/000000/github.png"
              alt="github"
              logo
            />
          </a>
        </nav>

        <div className="container">
          <div className="text-center titlediv">
            <h2 className="center">{/* Share your favourite movies  */}</h2>
          </div>

          <>
            <AsyncSelect
              className="search"
              cacheOptions
              value={this.state.selectedOption}
              loadOptions={this.getOptions}
              placeholder={"enter movie name"}
              onChange={this.handleChange}
              components={{ MenuList }}
              defaultValue={this.state.selectedOption}
              menuIsOpen={this.state.open}
            />

            <div className="container cardcontainer">
              {this.state.movies.map((ele) => {
                return <Card data={ele} removemovieaction={this.removemovie} />;
              })}
            </div>
          </>
        </div>
      </>
    );
  }
}

export default Movie;
