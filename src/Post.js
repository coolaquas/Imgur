import React, { useState, useEffect } from 'react';
import './Post.css';    
import { db } from './firebase'

import Avatar from "@material-ui/core/Avatar";


function Post({ username, user, caption, imageUrl, postId, votes }) {

    const checkVideo = (imageUrl.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
    const [voter, setVoter] = useState(false);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line array-callback-return
            votes.map((vote) => {
                if (user.displayName === vote) {
                    setVoter(true);
                } else {
                    setVoter(false);
                }
            })
        }
    }, [voter, user, votes])

    const handleVote = () => {
        let postReference = db
                            .collection("posts")
                            .doc(postId)
                            .get();
        if (voter) {
            postReference
                .then((doc) => {
                        let voteUpdate = doc.data().vote;
                        voteUpdate = voteUpdate.filter(item => item !== user.displayName )
                        console.log(voteUpdate);
                        db.collection("posts").doc(postId).update({
                            vote: voteUpdate
                        })
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
                setVoter(false);

        } else {
            postReference
                .then((doc) => {
                        let voteUpdate = doc.data().vote;
                        voteUpdate.push(user.displayName);
                        console.log(voteUpdate);
                        db.collection("posts").doc(postId).update({
                            vote: voteUpdate
                        })
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
                setVoter(true);
        }
    }
    const handleShare = () => {
        navigator.clipboard.writeText(imageUrl);
        alert("🎗️🎗️🎗️ link copied for shareing 🎗️🎗️🎗️");
    }
    return (
        <div className="post">
            <div className="post__media"> {(checkVideo === "mp4") || (checkVideo === "ogg") ? <video autoPlay loop muted><source src={imageUrl} type="video/mp4" />your browser does not support video</video> : <img src={imageUrl} loading='lazy' alt="" />} </div>
            <div className="post__meta">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDA2KqrQNsRvr0y5pOeDSegH24i6WTQ5gpeg&usqp=CAU'}
                />
                <div className="post__meta__username">@{username}</div>
            </div>
            <div className="post__details">
                <h4 className="post__text"> {caption} </h4>
                <div className="post__effects">
                    <div className="vote__Temp"> <button disabled={!user} onClick={handleVote}> {voter ? <span role="img" aria-label="Vote"> 👎 </span> : <span role="img" aria-label="Vote"> 👍 </span>} </button> {votes.length} </div>
                    <button id="share__Post" onClick={handleShare}> <span role="img" aria-label="Comments">🔗</span> </button>
                    <button disabled> <span role="img" aria-label="View">👁 0</span> </button>
                    <button disabled> <span role="img" aria-label="Comments">💬 0</span> </button>
                    
                </div>
            </div>
        </div>
    )
}

export default Post



// <button disabled={!user} onClick={() => alert("thumps-Down  Clicked")}> <span role="img" aria-label="Thumps-Down">👎</span> </button>