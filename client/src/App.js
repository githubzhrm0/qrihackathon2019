import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Row, Col, Card, CardDeck, Container, CardBody, CardHeader } from 'reactstrap';

import Header from './components/Header'
import SearchForm from './components/SearchForm'
import MovieCard from './components/MovieCard'

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      searchResultClass: "d-none",
      similarMovies: [],
      selectedMovieName: '',
      similarMovieClass: "d-none",
    }
  }

  submitFormAPI = (payload) => {
    console.log('PAYLOAD', payload)
    fetch("/get_recommendation", {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json',
      },
    }).then(res => res.json())
      .then(data => {
        const movies = data.movies
        this.setState({
          movies: movies,
          searchResultClass: "d-block",
          similarMovies: [],
          selectedMovieName: '',
          similarMovieClass: "d-none",
        })
      })
      .catch(err => err);
  }

  changeFavoriteAPI = (isfavorite, movieId, userId) => {
    const payload = { isfavorite: isfavorite, movieId: movieId, userId: userId }
    console.log('PAYLOAD', payload)
    fetch("/add_to_favorite", {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json',
      },
    }).then(res => console.log(res))
      .catch(err => err);
  }

  getSimilarMovieAPI = (movieName, movieId, userId) => {
    const payload = { movieId: movieId, userId: userId }
    console.log('PAYLOAD_BEFORE_PASS', payload)
    fetch("/get_similar_movies", {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json',
      },
    }).then(res => res.json())
      .then(data => {
        const movies = data.movies
        this.setState({
          selectedMovieName: movieName,
          similarMovies: movies,
          similarMovieClass: "d-block",
        })
      })
      .catch(err => err);
  }

  getDistinctAPI = () => {
    fetch("/get_meta")
      .then(res => res.json())
      .then(data => {
        const genres = ['tv', 'documentary', 'drama', 'comedy', 'mystery', 'history', 'fantasy', 'western', 'war', 'science', 'foreign', 'animation', 'music', 'adventure', 'crime', 'action', 'romance', 'fiction', 'horror', 'family', 'thriller', 'movie']
        genres.sort()
        const dct = {
          genres,
          countries: data.countryData.filter((el) => el.length > 1).slice(0, 20),
          languages: data.languageData.slice(0, 20)
        }
        this.setState(dct)
      })
      .catch(err => err);
  }

  componentWillMount() {

    this.getDistinctAPI()

    this.setState({
      genres: [],
      countries: [],
      languages: []
    });

  }

  render() {

    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 8,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };

    return (
      <div className="App">
        <Header />
        <Container fluid={true}>
          <Card>
            <CardHeader><h2>Search Criterion</h2></CardHeader>
            <CardBody>
              <SearchForm
                genres={this.state.genres}
                countries={this.state.countries}
                languages={this.state.languages}
                submitFormAPI={this.submitFormAPI} />
            </CardBody>
          </Card>
        </Container>

        <Container fluid={true} className={this.state.searchResultClass}>
          <Card>
            <CardHeader><h2>Search Results</h2></CardHeader>
            <CardBody>
              <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                keyBoardControl={true}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
              >
                {this.state.movies.map(movie =>
                  <MovieCard
                    key={movie.movieId}
                    url={movie.url}
                    title={movie.title}
                    overview={movie.overview}
                    imdbId={movie.imdbId}
                    userId={movie.userId}
                    isfavorite={movie.isfavorite}
                    movieId={movie.movieId} //!!!! id
                    changeFavoriteHandler={this.changeFavoriteAPI}
                    getSimilarMovieHandler={this.getSimilarMovieAPI}
                  />
                )}
              </Carousel>
            </CardBody>
          </Card>
        </Container>

        <Container fluid={true} className={this.state.similarMovieClass}>
          <Card>
            <CardHeader><h2>Similar Movies To "{this.state.selectedMovieName}"</h2></CardHeader>
            <CardBody>
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                keyBoardControl={true}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
              >
                {this.state.similarMovies.map(movie =>
                    <MovieCard
                      key={movie.movieId}
                      url={movie.url}
                      title={movie.title}
                      overview={movie.overview}
                      imdbId={movie.imdbId}
                      userId={movie.userId}
                      isfavorite={movie.isfavorite}
                      movieId={movie.movieId} //!!!! id
                      changeFavoriteHandler={this.changeFavoriteAPI}
                    />
                )}
              </Carousel>
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default App;