import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { storage, db } from "./firebase";
import { useDropzone } from "react-dropzone";
import './uploader.css';

function ImageUpload({ user }) {
    let userName = user.displayName;
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");
    const [files, setFiles] = useState([]);
    const [finalUploader, setFinalUploader] = useState(null);
    const [directImageUrl, setDirectImageUrl] = useState("");
    const [DisplayImages, setDisplayImages] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: ".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.ogg",
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            )
        },
    })

    let dragImage = files[0];
    useEffect(() => {
        if (dragImage !== undefined) {
            setFinalUploader(dragImage);
            setDirectImageUrl("");
        }
        if (image !== null) {
            setFinalUploader(image);
            setDirectImageUrl("");
        }
    }, [image, dragImage])

    useEffect(() => {
        if (directImageUrl !== "") {
            setDisplayImages
                (
                    <React.Fragment>
                        <div>
                            <img src={directImageUrl} style={{ width: "200px", height: "200px" }} alt="preview" />
                        </div>
                    </React.Fragment>
                )
        } else if (dragImage !== undefined) {
            setDisplayImages
                (
                    files.map((file) => (
                        <div key={file.name}>
                            <div>
                                <img src={file.preview} style={{ width: "200px", height: "200px" }} alt="preview" />
                            </div>
                        </div>
                    ))
                )
        }
    }, [directImageUrl, dragImage, files])

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    let handleDirectImageUrl = (event) => {
        setDirectImageUrl(event.target.value);
        setFinalUploader(null);
    }

    const handleUpload = () => {
        if (finalUploader === null && directImageUrl === "") {
            alert("Please choose a Image/Video or paste direcet URL for submiting");
        } else if (directImageUrl !== "") {
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: directImageUrl,
                username: userName,
                vote: []
            });
            setCaption("");
            setDirectImageUrl("");
            setDisplayImages(null);
        } else {
            const uploadTask = storage.ref(`images/${finalUploader.name}`).put(finalUploader);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref("images")
                        .child(finalUploader.name)
                        .getDownloadURL()
                        .then(url => {
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                imageUrl: url,
                                username: userName,
                                vote: []
                            });
                            setProgress(0);
                            setCaption("");
                            setImage(null);
                            setDirectImageUrl("");
                            setDisplayImages
                                (null);
                        });
                }
            )
        }
    }

    return (
        <React.Fragment>
            <div className="dropzone">
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drop files here</p>
                    <p>or</p>
                </div>
                <div>{DisplayImages}</div>
            </div>
            <div className="posting">
                <p>
                    <input id="file-input" type="file" name="files" multiple="" accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm" onChange={handleChange} />
                </p>
                <input type="text" id="imageUrl" placeholder="Paste the image URL/link here directly" onChange={handleDirectImageUrl} value={directImageUrl} />
                <input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption} />
            </div>

            <button className="uplopad__button" onClick={handleUpload}>
                Upload
            </button>
            {progress > 0 ? <progress className="imageupload__progress" value={progress} max='100' /> : null}
        </React.Fragment>
    )
}

export default ImageUpload
