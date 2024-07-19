import React, { useEffect, useState } from "react";
import "./app.scss";
import { useNavigate } from "react-router-dom";
import Header from "../multipage/Header/Header";
import config from "../config.js";
import Footer from "../multipage/Footer/Footer.jsx";
import { IKImage } from "imagekitio-react";
import InfiniteScroll from "react-infinite-scroll-component";
import pin from "./app_assets/pin.png";
import search from "./app_assets/search.png";
import calendar from "./app_assets/calendar.png";

const App = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [selectedCountry, setSelectedCountry] = useState("sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const limit = 16;

  useEffect(() => {
    const fetch_posts = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}?limit=${limit}&skip=${skip}`
        );
        const data = await response.json();
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setDisplayedPosts((prevDisplayedPosts) => [
          ...prevDisplayedPosts,
          ...data,
        ]);
        if (data.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("GRESKA");
      }
    };
    fetch_posts();
  }, [skip]);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCountry, searchQuery]);

  const filterPosts = () => {
    let filteredPosts = posts;

    if (selectedCountry !== "sve") {
      filteredPosts = filteredPosts.filter(
        (post) => post.country === selectedCountry
      );
    }

    if (searchQuery) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Reverse the array to show newest posts first
    filteredPosts = filteredPosts.slice();

    setDisplayedPosts(filteredPosts);
  };

  const get_id = (id) => {
    navigate(`/usluga/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-BA", options);
  };
  const urlEndpoint = "https://ik.imagekit.io/ndnqlrl7ez/";

  const fetchMoreData = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Header />
      <div className="search_sort">
        <div className="search">
          <input
            type="text"
            placeholder="Pretraga"
            className="search_input"
            value={searchText}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>
            <img src={search} alt="Search" />
          </button>
        </div>
        <div className={`sort ${scrollDirection === "down" ? "hidden" : ""}`}>
          <label htmlFor="country">Država:</label>
          <select
            name="country"
            id="country"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="sve">Sve</option>
            <option value="BiH">BiH</option>
            <option value="Srbija">Srbija</option>
            <option value="Crna Gora">Crna Gora</option>
            <option value="Hrvatska">Hrvatska</option>
          </select>
        </div>
      </div>
      <InfiniteScroll
        dataLength={displayedPosts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h2 id="loader">Učitavanje usluga...</h2>}
      >
        <div className="posts">
          {displayedPosts.map((element, index) => (
            <div
              className="post"
              key={index}
              onClick={() => {
                get_id(element._id);
              }}
            >
              <IKImage
                urlEndpoint={urlEndpoint}
                path={element.image ? element.image : "no_image.jpg"}
                loading="lazy"
                height="300px"
                width="100%"
                lqip={{ active: true }}
              />
              <h1>{element.title}</h1>
              <p>
                <img src={calendar} alt="Calendar" />{" "}
                {formatDate(element.createdAt)}
              </p>
              <p id="where">
                <img src={pin} alt="Location" /> {element.country},{" "}
                {element.city}
              </p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      <Footer />
    </>
  );
};

export default App;
