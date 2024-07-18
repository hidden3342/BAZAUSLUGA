import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import "./account.scss";
import user_img from "./acc_assets/user.png";
import calendar from "./acc_assets/calendar.png";
import Header from "../multipage/Header/Header";
import { IKImage } from "imagekitio-react";
import pin from "./acc_assets/pin.png";
import Footer from "../multipage/Footer/Footer";
const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // new state for posts

  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}korisnik/${username}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
        console.log(data);

        // fetch posts when user is found
        const fetchPosts = async () => {
          try {
            const response = await fetch(`${config.backendUrl}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const postsData = await response.json();
            const userPosts = postsData.filter((post) => post.by === username);
            setPosts(userPosts);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
        fetchPosts();
      } catch (error) {
        setError(error.message);
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchUser();
  }, [username]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-BA", options);
  };
  const urlEndpoint = "https://ik.imagekit.io/ndnqlrl7ez/";

  return (
    <>
      <Header />
      <div className="account_container">
        <div className="left_side">
          <p>
            <img src={user_img} alt="" /> {user && user.username}
          </p>
          <p>
            <img src={calendar} alt="" /> {formatDate(user && user.createdAt)}
          </p>
        </div>
        <div className="right_side">
          {posts.length > 0 ? (
            <ul>
              {posts.map((element, index) => (
                <div
                  className="post"
                  key={index}
                  onClick={() => {
                    window.location.href = `/usluga/${element._id}`;
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
                    <img src={calendar} alt="" />{" "}
                    {formatDate(element.createdAt)}
                  </p>
                  <p id="where">
                    <img src={pin} alt="" /> {element.country}, {element.city}
                  </p>
                </div>
              ))}
            </ul>
          ) : (
            <p>Nema usluga</p>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Account;
