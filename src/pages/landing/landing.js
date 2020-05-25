import React from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import jwt from "jsonwebtoken";
import _ from "lodash";
import "./landing.css";
import Card from "../../components/card";
import Swal from "sweetalert2";

const api = "https://imdbmovieapp-e7c00.web.app/";

const MenuList = (props) => {
  console.log(props);
  return (
    <components.MenuList {...props}>
      {console.log(props.options)}
      {props.options.length !== 0 ? (
        props.options.map((ele) => {
          return (
            <div
              className="cusotmemenu"
              onClick={(e) => {
                console.log(ele.value);

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
    console.log(window.location.href);

    var url = window.location.href;

    var data = url.split("?d");

    console.log(data);

    if (data.length > 1) {
      this.setState({ loadfromurl: true });
      // var base64data = data[1];
      var decode = jwt.decode(data[1]);

      if (decode) {
        this.setState({ sharername: decode.name });
        decode.imdbcodes.forEach((element) => {
          fetch(`https://www.omdbapi.com/?i=${element}&apikey=4c3b0a9a`)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);

              this.setState({
                movies: [data, ...this.state.movies],
              });
            });
        });
      } else {
        this.setState({ loadfromurl: false });
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "This link might have broken ",
          // footer: "<a href>Why do I have this issue?</a>",
        });
      }
    }


  }

  handleChange = (selectedOption) => {
    console.log(selectedOption);

    this.setState({
      selectedOption: [{ label: "", value: 1 }],
      open: false,
    });
    // // this.setState({});
    // console.log(selectedOption);

    if (this.state.movies.length) {
      for (let index = 0; index < this.state.movies.length; index++) {
        const element = this.state.movies[index];

        if (element.value === selectedOption.value) {
          console.log("duplicates");
          break;
        } else {
          fetch(
            `https://www.omdbapi.com/?i=${selectedOption.value}&apikey=4c3b0a9a`
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data);

              this.setState({
                movies: [data, ...this.state.movies],
                imdbcode: [selectedOption.value, ...this.state.imdbcode],
                selectedOption: [{ label: "", value: 1 }],
              });
            });

          break;
        }
      }
    } else {
      fetch(
        `https://www.omdbapi.com/?i=${selectedOption.value}&apikey=4c3b0a9a`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          this.setState({
            movies: [data],
            imdbcode: [selectedOption.value],
            selectedOption: [{ label: "", value: 1 }],
          });
        });
    }
  };

  getOptions = (inputValue, callback) => {
    this.setState({ open: true });
    console.log("inputs - - " + inputValue);
    if (!inputValue) {
      return callback([{ label: "Nothing........", value: 1 }]);
    }

    fetch(`https://www.omdbapi.com/?s=${inputValue}&apikey=4c3b0a9a`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

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
        console.log("resolve");
        console.log(payload);
        callback(payload);
      })
      .catch((err) => console.log(err));
  };

  removemovie = (imdbid) => {
    console.log(imdbid);

    var indexc = this.state.imdbcode.indexOf(imdbid);

    console.log(indexc);

    let mm = [...this.state.movies];
    let ii = [...this.state.imdbcode];

    mm.splice(indexc, 1);
    ii.splice(indexc, 1);

    this.setState({ movies: mm, imdbcode: ii });
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

          {this.state.loadfromurl ? (
            <div>
              <h3 className="sharetitle">
                {this.state.sharername
                  ? `${this.state.sharername} shared some cool movies with you`
                  : "Someone shared some cool movies with you"}{" "}
              </h3>
              <a className="btn btn-success sharebutton" href={api}>
                Make my own list
              </a>
              <div className="container cardcontainer">
                {this.state.movies.map((ele) => {
                  return <Card data={ele} />;
                })}
              </div>
            </div>
          ) : (
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

              <button
                className="btn btn-success sharebutton"
                disabled={this.state.imdbcode.length > 0 ? false : true}
                onClick={() => {
                  console.log(this.state.imdbcode);

                  Swal.fire({
                    title: "Pardon your name",
                    input: "text",
                    inputAttributes: {
                      autocapitalize: "off",
                    },
                    // showCancelButton: true,
                    confirmButtonText: "Share movie list",
                    // showLoaderOnConfirm: true,
                    preConfirm: (name) => {
                      return new Promise((resolve) => {
                        var payload = jwt.sign(
                          JSON.stringify({
                            name: name,
                            imdbcodes: this.state.imdbcode,
                          }),
                          "123"
                        );
                        console.log(payload);
                        var url = `${api}?d${payload}`;
                        console.log(url);

                        resolve(url);
                      });
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                  }).then((result) => {
                    if (result.value) {
                      console.log(result);
                      Swal.fire({
                        title: "Share file",
                        input: "text",
                        inputValue: result.value,
                        showCancelButton: true,
                        inputAttributes: {
                          id: "sharefilelinkswaltectinput",
                        },
                        // text: " Error deleting file",
                        html:
                          '<button class="btn btn-primary" id="sharefilelinkswalcopybtn" >Copy link</button> ',
                        icon: "success",
                        confirmButtonText: "Cool",
                      });
                      var copysharebtnnn = document.getElementById(
                        "sharefilelinkswalcopybtn"
                      );
                      copysharebtnnn.addEventListener("click", function () {
                        // alert("boom");
                        var copyText = document.getElementById(
                          "sharefilelinkswaltectinput"
                        );

                        /* Select the text field */
                        copyText.select();
                        copyText.setSelectionRange(
                          0,
                          99999
                        ); /*For mobile devices*/

                        /* Copy the text inside the text field */
                        document.execCommand("copy");
                      });
                    }
                  });
                }}
              >
                Share
              </button>
              <button
                disabled={this.state.imdbcode.length > 0 ? false : true}
                className="btn btn-warning clearbutton"
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Clear this list!",
                  }).then((result) => {
                    if (result.value) {
                      this.setState({ imdbcode: [], movies: [] });
                      Swal.fire(
                        "Donezo !",
                        "Your list is invisible now 😋",
                        "success"
                      );
                    }
                  });
                }}
              >
                Clear list
              </button>
              <div className="container cardcontainer">
                {this.state.movies.map((ele) => {
                  return (
                    <Card data={ele} removemovieaction={this.removemovie} />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Movie;
