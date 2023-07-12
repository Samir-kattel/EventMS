import React, { useEffect, useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [image, setImage] = useState("");
  const [allImage, setAllImage] = useState([]);
  const [img, setImg] = useState();
  const [fetchImage, setFetchImage] = useState([]);

  useEffect(() => {
    getImage();
  }, []);

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImg(onLoadEvent.target.result);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);

    setAllImage(changeEvent.target.files[0]);
  }

  async function uploadImage() {
    console.log("helloimage");
    try {
      const data = new FormData();
      data.append("file", allImage);
      data.append("upload_preset", "gzk5vqdl");
      data.append("cloud_name", "dddpt1gec");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dddpt1gec/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const res2 = await res.json();
      console.log(res2);
      if (res2.error) {
        console.log("something went wrong");
      } else {
        let x = res2.url;
        console.log(x);
        console.log("image uploaded successfully");
        const data = {
          image: x,
        };

        axios({
          method: "post",
          url: "http://localhost:5000/upload-image",
          data: data,
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  //   function uploadImage() {

  <button onClick={uploadImage}>Upload</button>;

  function getImage() {
    fetch("http://localhost:5000/get-image", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchImage(data.data);
      });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner" style={{ width: "auto" }}>
        You can upload image from here.
        <br />
        <input accept="image/*" type="file" onChange={handleOnChange} />
        {img === "" || img == null ? (
          ""
        ) : (
          <img
            width={100}
            height={100}
            src={img}
            alt="A beautiful sunset over the mountains"
          />
        )}
        <button onClick={uploadImage}>Upload</button>
        <br />
        {fetchImage.map((data) => {
          return (
            <img
              width={100}
              height={100}
              src={data.image}
              alt="Morning Sunrise view of Everest"
            />
          );
        })}
      </div>
    </div>
  );
}

export default ImageUpload;
