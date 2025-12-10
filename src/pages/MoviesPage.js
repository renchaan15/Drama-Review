import React from 'react';
import Row from '../components/Row';
import Banner from '../components/Banner';
import './SearchPage.css'; 

const MoviesPage = () => {
  return (
    <div className="search-page">
      {/* Banner Khusus Movies */}
      <Banner fetchUrl="/trending/movie/week" />

      <div className="home-rows">
        <Row title="Trending Movies" fetchUrl="/trending/movie/week?" isLargeRow />
        <Row title="Top Rated Movies" fetchUrl="/movie/top_rated?" />
        <Row title="Action Thrillers" fetchUrl="/discover/movie?with_genres=28" />
        <Row title="Comedy Hits" fetchUrl="/discover/movie?with_genres=35" />
        <Row title="Horror Movies" fetchUrl="/discover/movie?with_genres=27" />
        <Row title="Romance" fetchUrl="/discover/movie?with_genres=10749" />
        <Row title="Family & Kids" fetchUrl="/discover/movie?with_genres=10751" />
      </div>
    </div>
  );
};

export default MoviesPage;