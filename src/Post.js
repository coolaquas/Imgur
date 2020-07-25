import React, { useState, useEffect } from 'react';
import { db } from './firebase'
import Avatar from "@material-ui/core/Avatar";
import './Post.css';


function Post({ username, user, caption, imageUrl, postId, votes }) {

    const isVideoFormat = (imageUrl.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
    const [voter, setVoter] = useState(false);


    //use Effect hooks used for check and assigning the voter value
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

    // handleVote method deals with the voting option on every post.
    const handleVote = () => {
        let postReference = db
            .collection("posts")
            .doc(postId)
            .get();
        //Validation If the user is already voted then remove the vote.
        if (voter) {
            postReference
                .then((doc) => {
                    let voteUpdate = doc.data().vote;
                    voteUpdate = voteUpdate.filter(item => item !== user.displayName)
                    console.log(voteUpdate);
                    db.collection("posts").doc(postId).update({
                        vote: voteUpdate
                    })
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
            setVoter(false);
        }
        //Validation If the user is not already voted then Add the vote.  
        else {
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
    // handleShare method deals with the link copying option for sharing.
    const handleShare = () => {
        navigator.clipboard.writeText(imageUrl);
        alert("🎗️🎗️🎗️ link copied for shareing 🎗️🎗️🎗️");
    }



    return (
        <div className="post">
            <div className="post__media"> {(isVideoFormat === "mp4") || (isVideoFormat === "ogg") || (isVideoFormat === "avi")? <video autoPlay loop muted><source src={imageUrl} type="video/mp4" />your browser does not support video</video> : <img src={imageUrl} loading='lazy' alt="" />} </div>
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
                    <button className="disabled__button" disabled> <span role="img" aria-label="View">👁 0</span> </button>
                    <button className="disabled__button" disabled> <span role="img" aria-label="Comments">💬 0</span> </button>

                </div>
            </div>
        </div>
    )
}

export default Post