import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Back from "../svg/Back";
import Download from "../svg/Download";
import More from "../svg/More";
import Share from "../svg/Share";
import DownArrow from "../svg/DownArrow";
import { useSelector } from "react-redux";
import CommentCard from "../Components/CommentCard";
import Spinner from "../helpers/Spinner";
import Right from "../svg/Right";
import axios from "axios";
import MasonryLayout from "../Components/MasonryLayout";

const Pin = () => {
  const navigate = useNavigate();
  const commentRef = useRef(null);
  const [pin, setPin] = useState();
  const { username } = useParams();
  const [moreBtn, setMoreBtn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [commentShow, setCommentShow] = useState(true);
  const [commentInput, setCommentInput] = useState("");

  const { user } = useSelector((state) => state);

  const [relatedPins, setRelatedPins] = useState(null);
  const [relatedPinsLoading, setRelatedPinsLoading] = useState(true);

  const [copied, setCopied] = useState(false);

  const [pinSaved, setPinSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const getRelatedPins = async (pin) => {
    setRelatedPinsLoading(true);
    try {
      const { data } = await axios.get(
        "/api/pin/related?category=" + pin?.category
      );
      setRelatedPinsLoading(false);
      if (data.success) {
        setRelatedPins(
          data.pins.filter((returenedpin) => returenedpin?._id !== pin?._id)
        );
      }
    } catch (error) {
      setRelatedPinsLoading(false);
      console.log(error.response.data.message);
    }
  };

  const getPin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/pin/${username}`);
      setLoading(false);
      if (data.message === "Pin found" && data.status === 200) {
        setPin(data.pin);
        getRelatedPins(data.pin);
      }
    } catch (error) {
      setLoading(false);
      navigate("/");
      console.log(error.response.data.message);
    }
  };

  console.log(
    pin?.save?.map((savedId) => savedId.user?._id === user?.user?._id)
  );

  useEffect(() => {
    getPin();
  }, [username]);

  const getDestination = (destination) => {
    if (!destination?.startsWith("https://www." || "http://www.")) {
      return `https://${destination}`;
    }
    return destination;
  };

  const getDescription = (description) => {
    if (description?.length > 77 && !moreBtn) {
      return description.substring(0, 77) + "...";
    }
    return description;
  };

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/comment/${pin?._id}`, {
        comment: commentInput,
      });

      if (data.success) {
        setPin(data.pin);
        setCommentInput("");
        commentRef.current.scrollTop = commentRef.current.scrollHeight;
      }
    } catch (error) {
      console.log(error.response.data.message);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
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

  return loading ? (
    <div className="pt-24 flex h-[calc(100vh-120px)] justify-center items-center">
      <Spinner color="#000" size={2} />
    </div>
  ) : (
    <div className="pt-24 relative min-h-[calc(100vh-120px)]">
      <div className="relative px-4">
        <div>
          <Link
            to="/"
            className="w-10 h-10 rounded-full flex justify-center items-center absolute top-0 left-15 text-white hover:bg-gray-200"
          >
            <Back />
          </Link>
        </div>

        <div className="mx-auto shadow-lg rounded-3xl flex justify-center w-full max-w-[1000px] overflow-hidden singlePinCard p-4 gap-6">
          <div className="w-1/2 pinImage">
            <img
              src={pin?.image}
              alt={`Unable to find: ${pin?.name}`}
              className="w-full object-cover rounded-xl"
            />
          </div>

          <div className="w-1/2 bg-white table">
            <header className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer">
                  <More />
                </div>
                <div
                  onClick={() => downloadImage(pin?.image, pin?._id)}
                  className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  <Download />
                </div>
                <div
                  id="downloadParent"
                  className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer"
                  onClick={copyToClipboard}
                >
                  <Share />
                </div>
              </div>
              {pinSaved ||
              pin?.save
                ?.map((savedId) => savedId.user?._id === user?.user?._id)
                .includes(true) ? (
                <button className="px-4 py-2 text-white text-md font-bold bg-gray-800 rounded-full w-fit relative z-20">
                  Saved
                </button>
              ) : saving ? (
                <button
                  onClick={() => savePin(pin?._id)}
                  className="px-4 py-2 text-white text-md font-bold bg-gray-800 rounded-full w-fit relative z-20"
                >
                  Saving...
                </button>
              ) : (
                <button
                  onClick={() => savePin(pin?._id)}
                  className="px-4 py-2 text-white text-md font-bold bg-red-600 rounded-full w-fit relative z-20"
                >
                  Save
                </button>
              )}
            </header>
            <main className="mt-4">
              <a
                href={getDestination(pin?.destination)}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-xs underline"
              >
                {getDestination(pin?.destination)}
              </a>

              <h1 className="text-xl font-bold my-2">{pin?.title}</h1>
              <p className="text-sm font-normal my-2">
                {getDescription(pin?.description)}
                {pin?.description?.length > 77 && !moreBtn && (
                  <button
                    className="font-bold text-sm"
                    onClick={() => setMoreBtn(true)}
                  >
                    More
                  </button>
                )}
              </p>

              <Link
                to={`/${pin?.postedBy?.username}`}
                className="items-center gap-2 mt-4 inline-flex"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={pin?.postedBy?.profile_pic}
                    className="w-full rounded-full object-cover"
                    alt={pin?.postedBy?.name}
                  />
                </div>
                <div>
                  <h6 className="font-semibold font-md">
                    {pin?.postedBy?.name}
                  </h6>
                </div>
              </Link>

              <div className="comments mt-6">
                <button
                  className="font-semibold text-xl flex gap-2 items-center mb-4"
                  onClick={() => setCommentShow(!commentShow)}
                >
                  Comments {commentShow ? <DownArrow /> : <Right />}
                </button>

                <div
                  className="max-h-52 overflow-x-hidden overflow-y-auto commentContainer"
                  ref={commentRef}
                >
                  {commentShow &&
                    pin?.comments?.map((comment) => (
                      <CommentCard comment={comment} key={comment._id} />
                    ))}
                </div>

                <div className="flex gap-4 items-center mt-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      src={user?.user?.profile_pic}
                      className="rounded-full w-full h-full object-cover"
                      alt="user profile"
                    />
                  </div>

                  <form onSubmit={postComment} className="flex-1">
                    <input
                      type="text"
                      autoComplete="off"
                      name="comment"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a comment"
                      className="py-3 px-3 rounded-full border border-gray-300 w-full outline-none text-md"
                    />
                  </form>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="py-8 text-center mt-4">
          <h1 className="text-2xl font-semibold mb-3">More like this</h1>
          {relatedPinsLoading ? (
            <div className="flex justify-center items-center mt-4">
              <Spinner color={"#000"} size={4} />
            </div>
          ) : (
            <MasonryLayout pins={relatedPins} />
          )}
          {JSON.stringify(relatedPins) === "[]" && !relatedPinsLoading && (
            <div className="text-lg font-semibold text-gray-400 mt-6">
              Couldn't find any related Pins.
            </div>
          )}
        </div>
      </div>
      {copied && (
        <div
          className="absolute bottom-0 flex justify-center items-center copiedMessage"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="text-sm text-center rounded-lg p-4 rounded-full bg-gray-200">
            Copied to clipboard!
          </div>
        </div>
      )}
    </div>
  );
};

export default Pin;
