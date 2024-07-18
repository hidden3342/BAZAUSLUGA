import React, { useState, useEffect } from "react";
import config from "../config";
import "./profile.scss";
import user_img from "./pro_assets/user.png";
import calendar from "./pro_assets/calendar.png";
import bin from "./pro_assets/bin.png";
import pen from "./pro_assets/pen.png";

import Header from "../multipage/Header/Header";
import { IKImage } from "imagekitio-react";
import pin from "./pro_assets/pin.png";
import { jwtDecode } from "jwt-decode"; // Adjust the import if needed
import Footer from "../multipage/Footer/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // new state for posts
  const [username, setUsername] = useState("");
  const [deleteP, setDeleteP] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null); // new state for post to delete
  const [editP, setEditP] = useState(false); // new state for edit popup
  const [postToEdit, setPostToEdit] = useState(null); // new state for post to edit
  const [editedPostData, setEditedPostData] = useState({
    title: "",
    desc: "",
    city: "",
    country: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
        console.log(decodedToken.username); // Log the updated value
      } catch (error) {
        console.error("Invalid token:", error);
        setUsername("");
      }
    } else {
      setUsername("");
    }
  }, []);

  useEffect(() => {
    const delete_popup = document.getElementById("delete_popup");
    if (delete_popup) {
      if (!deleteP) {
        delete_popup.style.cssText = "display: none !important";
      } else {
        delete_popup.style.cssText = "display: flex !important";
      }
    }
  }, [deleteP]);

  useEffect(() => {
    const edit_popup = document.getElementById("edit_popup");
    if (edit_popup) {
      if (!editP) {
        edit_popup.style.cssText = "display: none !important";
      } else {
        edit_popup.style.cssText = "display: block !important";
      }
    }
  }, [editP]);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${config.backendUrl}nalog/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
        console.log(data);

        const fetchPosts = async () => {
          try {
            const response = await fetch(`${config.backendUrl}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const postsData = await response.json();
            const userPosts = postsData.filter((post) => post.by === username);
            setPosts(userPosts);
            console.log(postsData);
            console.log(posts);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const openDeletePopup = (e, post) => {
    e.stopPropagation();
    setPostToDelete(post);
    setDeleteP(true);
  };

  const deletePost = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`${config.backendUrl}${postToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the posts state to remove the deleted post
      setPosts(posts.filter((post) => post._id !== postToDelete._id));
      setDeleteP(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const openEditPopup = (e, post) => {
    e.stopPropagation();
    setPostToEdit(post);
    setEditedPostData({
      title: post.title,
      desc: post.desc,
      city: post.city,
      country: post.country,
      phone: post.phone,
      email: post.email,
    });
    setEditP(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updatePost = async () => {
    let msg_edit = document.getElementById("msg_edit");
    if (!postToEdit) return;

    if (editedPostData.title === "" || editedPostData.title.trim() === "") {
      msg_edit.innerText = "Unesite naslov";
      msg_edit.classList.add("m_e");
    } else if (
      editedPostData.desc === "" ||
      editedPostData.desc.trim() === ""
    ) {
      msg_edit.innerText = "Unesite opis";
      msg_edit.classList.add("m_e");
    } else if (
      editedPostData.city === "" ||
      editedPostData.city.trim() === ""
    ) {
      msg_edit.innerText = "Unesite grad";
      msg_edit.classList.add("m_e");
    } else if (
      editedPostData.country === "" ||
      editedPostData.country.trim() === ""
    ) {
      msg_edit.innerText = "Unesite državu";
      msg_edit.classList.add("m_e");
    } else if (
      editedPostData.phone === "" ||
      editedPostData.phone.trim() === ""
    ) {
      msg_edit.innerText = "Unesite broj telefona";
      msg_edit.classList.add("m_e");
    } else if (
      editedPostData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedPostData.email)
    ) {
      msg_edit.innerText = "Unesite validan email";
      msg_edit.classList.add("m_e");
    } else {
      try {
        const response = await fetch(`${config.backendUrl}${postToEdit._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedPostData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedPost = await response.json();

        // Update the posts state to reflect the edited post
        setPosts(
          posts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
        setTimeout(() => {
          setEditP(false);
        }, 1000);
        setPostToEdit(null);
        msg_edit.innerText = "Usluga uređena";
        msg_edit.classList.add("m_s");
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

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
          <button id="logout" onClick={handleLogout}>
            Odjavi se
          </button>
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
                    <img src={calendar} alt="" />
                    {formatDate(element.createdAt)}
                  </p>
                  <p id="where">
                    <img src={pin} alt="" /> {element.country}, {element.city}
                  </p>
                  <button
                    id="delete_post"
                    onClick={(e) => openDeletePopup(e, element)}
                  >
                    <img src={bin} alt="" id="del_b" />
                  </button>
                  <button
                    id="edit_post"
                    onClick={(e) => openEditPopup(e, element)}
                  >
                    <img src={pen} alt="" />
                  </button>
                </div>
              ))}
            </ul>
          ) : (
            <p>Nema usluga</p>
          )}
        </div>
        <div id="delete_popup">
          <h1>Izbriši uslugu</h1>
          <button onClick={deletePost}>DA</button>
          <button onClick={() => setDeleteP(false)}>NE</button>
        </div>
        <div id="edit_popup">
          <h1>Uredi uslugu</h1>
          <div>
            <p>Naslov</p>
            <input
              type="text"
              placeholder="Naslov"
              name="title"
              value={editedPostData.title}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <p>Opis</p>
            <textarea
              type="text"
              placeholder="Opis"
              name="desc"
              value={editedPostData.desc}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <p>Grad</p>
            <input
              type="text"
              placeholder="Grad"
              name="city"
              value={editedPostData.city}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <p>Država</p>
            <select
              name="country"
              id="country"
              value={editedPostData.country}
              onChange={handleEditInputChange}
            >
              <option value="BiH">BiH</option>
              <option value="Srbija">Srbija</option>
              <option value="Crna Gora">Crna Gora</option>
              <option value="Hrvatska">Hrvatska</option>
            </select>
          </div>
          <div>
            <p>Broj telefona</p>
            <input
              type="text"
              placeholder="Broj telefona"
              name="phone"
              value={editedPostData.phone}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <p>Email</p>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={editedPostData.email}
              onChange={handleEditInputChange}
            />
          </div>
          <p id="msg_edit"></p>
          <div className="button">
            <button onClick={updatePost}>Završi</button>
            <button onClick={() => setEditP(false)}>Zatvori</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
