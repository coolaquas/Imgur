import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';
import './App.css';
import Post from './Post';
import Uploader from './uploader';

//For adding and styleing custom MODAL using @material-ui
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function getModalStyle1() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `40%`,
    height: `68%`,
    backgroundColor: `#88cff9`,
    textAlign: `center`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
var color = {
  "color": "white",
  "fontWeight": "bolder",
  "marginRight": "5px",
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
//============================================================



function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const [modalStyle1] = React.useState(getModalStyle1);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newpost, setNewpost] = useState(false);

  //firebase user authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  // Firebase DB connectivity
  useEffect(() => {
    db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  //Sign up handler function

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  }

  //Sign In handler function

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);

  }


  
  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://res.cloudinary.com/ctung/image/upload/v1/2/original/:company/imgur.png"
                alt="Logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://res.cloudinary.com/ctung/image/upload/v1/2/original/:company/imgur.png"
                alt="Logo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={newpost}
        onClose={() => setNewpost(false)}
      >
        <div style={modalStyle1} className={classes.paper}>
          <div className="app__imageUploader">
          <Uploader user = {user} />
          </div>
        </div>
      </Modal>

      <div id="app__canvas"></div>
      <div className="app__header">
        <div className="navbar navbar-expand-lg navbar-light clr ">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <span className="imgur" href="">imgur</span>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active addbtn">
                <button disabled={!user} type="button" className="btn btn-success" onClick={() => setNewpost(true)}> <span style={color} >+</span>  New Post</button>
              </li>
              <li className="nav-item">

                <input className="form-control searchs mr-sm-4" type="search" placeholder="images,#tags @users oh my!" />
              </li>

            </ul>
            <div className="form-inline my-2 my-lg-0">
              {user ? (<React.Fragment><div className="app__usernameDisplay">Welcome Back, {user.displayName} </div> <button className="btn btn-success" onClick={() => auth.signOut()}>Log Out </button></React.Fragment>
              ) : (
                  <div className="app__loginContainer">
                    <button className="signin" onClick={() => setOpenSignIn(true)}>Sign In</button>
                    <button className="btn btn-success" onClick={() => setOpen(true)}>Sign Up</button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="post__container" >
        {
          posts.map(({ id, post }) => (
            <Post username={post.username} postId={id} user={user} caption={post.caption} imageUrl={post.imageUrl} votes={post.vote} key={id} />
          ))
        }
      </div>
    </div>
  );
}

export default App;
