import React, { useState } from "react";
import More from "../svg/More";
import { useSelector } from "react-redux";
import axios from "axios";
import Snipper from "../helpers/Spinner";
import Trash from "../svg/Trash";
import Up from "../svg/Up";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Art",
  "Culture",
  "Food",
  "Nature",
  "Sports",
  "Technology",
  "Travel",
  "Cars",
  "Fashion",
  "Music",
  "Dogs",
  "Website",
  "Other",
];

const CreatePin = () => {
  const navigate = useNavigate();
  const [pinForm, setPinForm] = useState({
    title: "",
    description: "",
    destination: "",
    category: "",
  });
  const [image, setImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cloudId, setCloudId] = useState("");
  const [uploading, setUploading] = useState();

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setPinForm({
      ...pinForm,
      [e.target.name]: e.target.value,
    });
  };

  const { user } = useSelector((state) => state.user);

  const uploadPin = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("pin", file);
    const { data } = await axios.post("/api/pin/upload", formData);

    if (data.status === 200) {
      console.log(data.response.cloudId);
      setUploadedImage(data.response.image);
      setCloudId(data.response.cloudId);
      setUploading(false);
    }
    setUploading(false);

    console.log(data);
  };

  const readImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };

    uploadPin(e.target.files[0]);
  };

  const submitPin = async () => {
    console.log(pinForm);
    setSaving(true);
    try {
      const { data } = await axios.post("/api/pin", {
        ...pinForm,
        image: uploadedImage,
        cloudId: cloudId,
      });
      setSaving(false);
      if (data.status === 201) {
        setPinForm({
          title: "",
          description: "",
          destination: "",
        });
        setImage("");
        setUploadedImage(null);
        setCloudId("");
        navigate("/");
      }
      console.log("Pin response: ", data);
    } catch (error) {
      setSaving(false);
      setError(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const removeImage = async () => {
    try {
      console.log("cloudId: ", cloudId.substring(5));
      const { data } = await axios.delete(
        `/api/pin/upload?cloudId=${cloudId.substring(5)}`
      );
      console.log(data);

      if (data.status === 200) {
        setUploadedImage(null);
        setCloudId("");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full py-40 bg-gray-200">
      <div className="board w-[900px]">
        <header className="flex gap-4 items-center">
          <button className="outline-none border-b-4 border-gray-900 text-black font-semibold text-md cursor-pointer">
            Create a Pin
          </button>
          <button className="outline-none border-b-4 border-transparent text-black font-semibold text-md cursor-pointer">
            Save from website
          </button>
        </header>
        <main className="bg-white rounded-xl mt-10">
          <header className="pt-8 py-2 px-6 flex justify-between items-center">
            <More />

            {error && (
              <div className="text-white font-semibold text-lg bg-red-500 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <button
              {...(saving && { disabled: true })}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-white font-semibold flex gap-2 items-center justify-center
              text-md"
              onClick={submitPin}
            >
              {saving && <Snipper />}
              Save
            </button>
          </header>
          <div className="flex justify-center items-start px-6 gap-4 py-6">
            <div
              className={
                uploadedImage
                  ? `relative rounded-md flex-1 flex justify-center items-start overflow-hidden`
                  : "bg-gray-200 relative rounded-md flex-1 flex justify-center items-start overflow-hidden"
              }
            >
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, iamge/ai, image/webp"
                single={"true"}
                className="hidden"
                id="uploadImage"
                onChange={readImage}
              />
              {uploadedImage ? (
                <button
                  onClick={removeImage}
                  style={{ transform: "translateY(-50%)" }}
                  className="w-10 h-10 rounded-full shadow-xl absolute top-1/2 left-2 z-50 bg-white flex justify-center items-center"
                >
                  <Trash />
                </button>
              ) : null}
              {!image && (
                <label
                  htmlFor="uploadImage"
                  className="w-full h-full flex flex-col justify-center items-center py-4 min-h-[500px] text-center cursor-pointer px-2"
                >
                  <Up />
                  <p className="mt-6 text-md">
                    <span>Click to upload</span>
                    <br />
                    <span className="font-medium mt-6 block">
                      Recommendation: Use high-quality .jpg files less than 20MB
                    </span>
                  </p>
                </label>
              )}
              {image && (
                <img
                  src={uploading === false ? uploadedImage : image}
                  alt=" sorry "
                  className="w-full rounded-md"
                />
              )}
              {uploading && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
                  <Snipper />
                </div>
              )}
            </div>
            <div className="bg-white flex-1 px-4">
              <div className="mb-3">
                <input
                  className="w-full text-2xl font-semibold border-b-2 border-gray-200 outline-none py-2"
                  name="title"
                  placeholder="Add your title"
                  id="title"
                  value={pinForm.title}
                  onChange={handleChange}
                />
              </div>
              <div className="my-4 flex items-center gap-2">
                <div className="w-10 h-10 rouneded-full">
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-full rounded-full"
                  />
                </div>
                <h1 className="text-lg font-semibold">{user.name}</h1>
              </div>

              <div className="my-4">
                <textarea
                  className="w-full text-sm font-medium border-b border-gray-200 outline-none"
                  name="description"
                  placeholder="Tell everyone what your pin is about"
                  id="description"
                  value={pinForm.description}
                  onChange={handleChange}
                  style={{ resize: "none", height: "11rem" }}
                />
              </div>
              <select
                className="w-full px-2 py-3 border-2 border-gray-200 rounded-md outline-none mb-4"
                value={pinForm.category}
                name="category"
                onChange={handleChange}
              >
                {CATEGORIES.map((category) => {
                  return (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  );
                })}
              </select>
              <div className="mb-3">
                <input
                  className="w-full text-sm font-normal border-b border-gray-200 outline-none"
                  name="destination"
                  placeholder="Add your Destination Link"
                  id="destination"
                  value={pinForm.destination}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePin;
