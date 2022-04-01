import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../helpers/Spinner";
import MasonryLayout from "../Components/MasonryLayout";
import { useSelector } from "react-redux";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { username } = useParams();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreated, setShowCreated] = useState(true);
  const [savedPins, setSavedPins] = useState([]);
  const [creater, setCreater] = useState();

  const getSavedPins = async (user) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/pin/save/${user?._id}`);
      setLoading(false);

      if (data.success) {
        const newSavedPins = data.savedPins.map((pin) => {
          return { ...pin.pin };
        });
        setSavedPins(newSavedPins);
      }
    } catch (error) {
      setLoading(false);
      // alert(error);
      console.log(error.message);
    }
  };

  const getpin = async (user) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/pin/user/${username}`);

      if (data.status === 200) {
        setPins(data.pins);
        getSavedPins(user);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };

  const getCreater = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/${username}`);
      setLoading(false);
      if (data.success) {
        setCreater(data.user);
        getpin(data.user);
      }
    } catch (error) {
      setLoading(false);
      navigate("/");
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getCreater();

    // return () => {
    //   setPins([]);
    //   setSavedPins([]);
    // };
  }, [user, username]);

  if (loading) {
    return (
      <div className="pt-24 flex justify-center items-center h-[calc(100vh-75px)]">
        <Spinner color={"#000"} size={3} />
      </div>
    );
  }

  return (
    <>
      <div className="pt-24">
        <header className="text-center pt-14">
          <div className="w-32 h-32 flex justify-center items-center mx-auto">
            <img
              src={creater?.profile_pic}
              alt="Profile"
              className="w-full rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold my-4">{creater?.name}</h1>
          <p className="text-sm font-normal my-2">
            {creater?.website && (
              <strong>
                <a
                  href={
                    !creater?.website?.startsWith("http://" || "https://") &&
                    `http://${creater?.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  {creater?.website}{" "}
                </a>
              </strong>
            )}
            @{creater?.username}
            {creater?.bio && <span>{` · ${creater?.bio}`} </span>}
          </p>
          <p className="text-sm my-2">0 following</p>
          {creater?._id === user?._id ? (
            <Link
              to={`/settings`}
              className="mt-6  inline-block bg-gray-200 my-2 px-4 py-[0.6em] rounded-full text-black font-semibold text-md mb-6"
            >
              Edit Profile
            </Link>
          ) : (
            <button
              className="
            px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-bold my-2 rounded-full mt-8 mb-6
            "
            >
              Follow
            </button>
          )}
        </header>
        <main className="text-center">
          <div className="flex justify-center items-cente gap-4">
            <button
              onClick={() => setShowCreated(true)}
              className={`${
                showCreated && "border-b-4 border-black"
              } text-black font-semibold text-lg`}
            >
              Created
            </button>
            {user?._id === creater?._id && (
              <button
                onClick={() => setShowCreated(false)}
                className={`${
                  !showCreated && "border-b-4 border-black"
                } text-black font-semibold text-lg`}
              >
                Saved
              </button>
            )}
          </div>
          {/* {console.log("showCreated: ", showCreated)} */}
          <div className="mt-4">
            {loading ? (
              <Spinner color={"#000"} size={3} />
            ) : (
              <MasonryLayout
                pins={showCreated ? pins : savedPins}
                saved={!showCreated}
              />
            )}
          </div>
        </main>
      </div>{" "}
    </>
  );
};

export default Profile;
