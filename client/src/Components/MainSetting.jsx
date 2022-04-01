import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUser } from "../redux/actions/userActions";
import Spinner from "../helpers/Spinner";
import { useLocation } from "react-router-dom";

const MainSetting = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [renamedUser, setRenamedUser] = useState({
    name: "",
    bio: "",
    profile_pic: "",
    username: "",
    website: "",
  });

  useEffect(() => {
    if (user) {
      setRenamedUser({ ...renamedUser, ...user });
    }
  }, [user]);

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        setUpdateSuccess(false);
        window.location.href = location.pathname;
      }, 1500);
    }
  }, [updateSuccess]);

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setRenamedUser({ ...renamedUser, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setRenamedUser({ ...renamedUser, ...user });
  };

  const UploadProfilePic = async (e) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      formData.append("cloudId", user.cloudId);
      const { data } = await axios.put(`/api/user`, formData);
      console.log(data);
      setUploading(false);
      if (data.success) {
        dispatch(fetchUser());
      }
    } catch (err) {
      setUploading(false);
      console.log(err.response.data.message);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { data } = await axios.put("/api/user/update", renamedUser);

      if (data.success) {
        setUpdateSuccess(true);
      }
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.log(error.response.data.message);
    }
  };

  const ChangeProfilePic = (e) => {
    const file = e.target.files[0];
    const data = new FileReader();
    data.readAsDataURL(file);
    data.onload = function (e) {
      setRenamedUser({ ...renamedUser, profile_pic: e.target.result });
    };
    UploadProfilePic(e);
  };

  return (
    <div className="pt-24 px-72 h-[calc(100vh-65px)] relative">
      <h1 className="text-3xl font-semibold">Public profile</h1>
      <p className="text-sm">
        People visiting your profile will see the following info
      </p>

      <form className="my-8 w-[600px]" onSubmit={submitForm}>
        <div className="mb-5 flex flex-col">
          <label className="mb-1 text-xs" htmlFor="profile_pic">
            Photo
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="profile_pic"
              className="hidden"
              onChange={ChangeProfilePic}
            />
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              {uploading && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              <img
                className="object-cover w-16 h-16 rounded-full"
                src={renamedUser?.profile_pic}
                alt="Profile not found!"
              />
            </div>
            <label
              htmlFor="profile_pic"
              className="cursor-pointer hover:bg-gray-300 block bg-gray-200 px-4 py-[0.6em] rounded-full text-black font-semibold text-md"
            >
              Change
            </label>
          </div>
        </div>
        <div className="mb-5 flex flex-col">
          <label className="mb-1 text-xs" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={renamedUser.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="px-4 py-2 rounded-xl border border-gray-300 text-sm outline-4 outline-offset-2 focus:outline-blue-200"
            autoComplete="off"
          />
        </div>
        <div className="mb-5 flex flex-col">
          <label className="mb-1 text-xs" htmlFor="name">
            Short bio
          </label>
          <input
            type="text"
            name="bio"
            id="bio"
            value={renamedUser.bio}
            onChange={handleChange}
            placeholder="Describe yourself"
            className="px-4 py-2 rounded-xl border border-gray-300 text-sm outline-4 outline-offset-2 focus:outline-blue-200"
            autoComplete="off"
          />
        </div>
        <div className="mb-5 flex flex-col">
          <label className="mb-1 text-xs" htmlFor="name">
            Website
          </label>
          <input
            type="text"
            name="website"
            id="website"
            value={renamedUser.website}
            onChange={handleChange}
            placeholder="Add a link to drive traffic to your site"
            className="px-4 py-2 rounded-xl border border-gray-300 text-sm outline-4 outline-offset-2 focus:outline-blue-200"
            autoComplete="off"
          />
        </div>
        <div className="mb-5 flex flex-col">
          <label className="mb-1 text-xs" htmlFor="name">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={renamedUser.username}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-gray-300 text-sm outline-4 outline-offset-2 focus:outline-blue-200"
            autoComplete="off"
          />
        </div>
      </form>

      {updateSuccess && (
        <div
          className={`absolute bottom-36 bg-black bg-opacity-70 rounded-xl text-white px-6 py-6 text-lg font-medium profileUpdated`}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          Profile Updated Successfully
        </div>
      )}

      <div
        className="fixed bottom-0 left-0 bg-white w-full py-4 flex gap-5 items-center justify-center"
        style={{
          boxShadow: "0 -4px 6px -1px rgb(0 0 0 / 10%)",
        }}
      >
        <button
          onClick={resetForm}
          className="bg-gray-100 px-4 py-[0.6em] rounded-full text-black font-semibold text-md hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          onClick={submitForm}
          className="rounded-full bg-red-600 text-white font-semibold py-3 px-4 hover:bg-red-700 text-md flex justify-center items-center gap-2"
        >
          Save
          {updating && <Spinner />}
        </button>
      </div>
    </div>
  );
};

export default MainSetting;
