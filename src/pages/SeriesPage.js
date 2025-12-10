import React from 'react';
import Row from '../components/Row';
import Banner from '../components/Banner';
import './SearchPage.css'; // Kita pinjam CSS dari SearchPage biar sama

const SeriesPage = () => {
  return (
    <div className="search-page">
      {/* Banner Khusus TV Series */}
      <Banner fetchUrl="/trending/tv/week" />

      <div className="home-rows">
        <Row title="Trending Series" fetchUrl="/trending/tv/week?" isLargeRow />
        <Row title="Top Rated Dramas" fetchUrl="/tv/top_rated?" />
        <Row title="Action & Adventure" fetchUrl="/discover/tv?with_genres=10759" />
        <Row title="Comedy Series" fetchUrl="/discover/tv?with_genres=35" />
        <Row title="Crime Dramas" fetchUrl="/discover/tv?with_genres=80" />
        <Row title="Sci-Fi & Fantasy" fetchUrl="/discover/tv?with_genres=10765" />
        <Row title="Documentaries" fetchUrl="/discover/tv?with_genres=99" />
      </div>
    </div>
  );
};

export default SeriesPage;