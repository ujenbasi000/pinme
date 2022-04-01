import React from "react";
import Download from "../svg/Download";
import More from "../svg/More";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const PinCard = ({ pin, saved }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  console.log(
    user._id,
    pin?.save,
    pin?.save?.map((savedId) => savedId.user?._id === user?._id).includes(true)
  );

  const [hover, setHover] = useState(false);
  const [pinSaved, setPinSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const getDestination = (destination) => {
    if (!destination) {
      return "";
    }
    if (destination.startsWith("http://www.")) {
      return `${destination.slice(10, 17)}...`;
    } else if (destination.startsWith("http://")) {
      return `${destination.slice(7, 14)}...`;
    } else if (destination.startsWith("https://www.")) {
      return `${destination.slice(12, 19)}...`;
    } else if (destination.startsWith("https://")) {
      return `${destination.slice(8, 15)}...`;
    } else {
      return `${destination.slice(0, 7)}...`;
    }
  };

  const getLink = (destination) => {
    if (!destination) {
      return "";
    }
    if (destination.startsWith("http://www.")) {
      return destination;
    } else if (destination.startsWith("http://")) {
      return destination;
    } else if (destination.startsWith("https://www.")) {
      return destination;
    } else if (destination.startsWith("https://")) {
      return destination;
    } else {
      return `http://${destination}`;
    }
  };

  const downloadImage = (image, _id) => {
    fetch(image)
      .then((response) => response.blob())
      .then((blog) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const link = document.createElement("a");
          link.setAttribute("download", _id);
          link.href = reader.result;
          document.getElementById("downloadParent").appendChild(link);
          link.click();
          link.remove();
        });

        reader.readAsDataURL(blog);
      });
  };

  const savePin = async (id) => {
    try {
      setSaving(true);
      const { data } = await axios.post(`/api/pin/save/${id}`);
      if (data.success) {
        setSaving(false);
        setPinSaved(true);
      }
    } catch (error) {
      setPinSaved(false);
      setSaving(false);
      console.log(error.response.data.message);
    }
  };

  const deleteSavedPin = async (id) => {
    try {
      const { data } = await axios.delete(`/api/pin/save/${id}`);
      if (data.success) {
        window.location.reload();
      }
      console.log(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="block my-2 px-2">
      <div
        className="my-2 relative pinCard block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="w-full cursor-zoom-in">
          <img className="rounded-3xl w-full" src={pin?.image} alt="" />
        </div>

        {hover && (
          <div
            className="rounded-3xl bg-black bg-opacity-50 h-full absolute top-0 left-0 w-full p-4 cursor-zoom-in z-10"
            onClick={() => {
              navigate(`/pin/${pin._id}`);
            }}
          ></div>
        )}
        <div className="flex justify-between items-end h-full flex-col absolute top-0 left-0 w-full p-4 pinCardActions">
          {saved ? (
            <div className="flex gap-2 w-full h-full justify-end items-end">
              <div className="flex gap-2" id="downloadParent">
                <div
                  onClick={() => downloadImage(pin.image, pin._id)}
                  className="cursor-pointer bg-white bg-opacity-80 flex justify-center items-center w-10 bg-gray-200 rounded-full relative z-20 py-2"
                >
                  <Download />
                </div>
                <div
                  className="cursor-pointer bg-white bg-opacity-80 flex justify-center items-center w-10 bg-gray-200 rounded-full relative z-20 py-2"
                  onClick={() => deleteSavedPin(pin._id)}
                >
                  <i className="uil uil-trash-alt text-xl" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {pinSaved ||
              pin?.save
                ?.map((savedId) => savedId.user?._id === user?._id)
                .includes(true) ? (
                <button className="px-4 py-2 text-white text-md font-bold bg-gray-800 rounded-full w-fit relative z-20">
                  Saved
                </button>
              ) : saving ? (
                <button
                  onClick={() => savePin(pin._id)}
                  className="px-4 py-2 text-white text-md font-bold bg-gray-800 rounded-full w-fit relative z-20"
                >
                  Saving...
                </button>
              ) : (
                <button
                  onClick={() => savePin(pin._id)}
                  className="px-4 py-2 text-white text-md font-bold bg-red-600 rounded-full w-fit relative z-20"
                >
                  Save
                </button>
              )}
              <div className="flex gap-2 w-full justify-between">
                <a
                  href={getLink(pin?.destination)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-80 px-3 py-2 rounded-full bg-gray-200 font-semibold w-fit block text-xs relative z-20"
                >
                  {getDestination(pin?.destination)}
                </a>
                <div className="flex gap-2" id="downloadParent">
                  <div
                    onClick={() => downloadImage(pin.image, pin._id)}
                    className="cursor-pointer bg-white bg-opacity-80 flex justify-center items-center w-10 bg-gray-200 rounded-full relative z-20"
                  >
                    <Download />
                  </div>
                  <div className="bg-white bg-opacity-80 flex justify-center items-center w-10 bg-gray-200 rounded-full relative z-20">
                    <More />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-1 items-center">
        {pin.title ? (
          <h1 className="px-2 text-sm font-semibold">{pin.title}</h1>
        ) : (
          <>
            <Link
              to={`/${pin?.postedBy?.username || pin?.postedBy?._id}`}
              className="w-10"
            >
              <img
                className="rounded-full w-full"
                alt=""
                src={pin?.postedBy?.profile_pic}
              />
            </Link>
            <span className="text-md font-semibold">{pin?.postedBy?.name}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default PinCard;
