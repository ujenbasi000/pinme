import { Link, useNavigate } from "react-router-dom";
import Logo from "../svg/Logo";
import Search from "../svg/Search";
import Down from "../svg/Down";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUser } from "../redux/actions/userActions";
import { useState } from "react";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const Navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();

  const logoutUser = async () => {
    setShowDropdown(false);
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        dispatch(fetchUser());
        Navigate("/login");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 py-2 bg-white">
      <div className="px-4 flex gap-4 items-center">
        <a href="https://www.pinterest.com/">
          <Logo />
        </a>
        <Link
          to="/"
          className="bg-black px-4 py-[0.6em] rounded-full text-white font-semibold text-md"
        >
          Home
        </Link>
        <form onSubmit={(e) => e.preventDefault()} className="w-full relative">
          <div className="absolute top-1/3 left-4">
            <Search />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            autoComplete="off"
            className="px-10 py-[0.7em] rounded-full text-sm font-normal placeholder:text-black bg-gray-200 hover:bg-gray-300 w-full outline-none border-4 border-transparent focus:border-blue-300"
          />
        </form>
        {user?.profile_pic && (
          <div className="flex gap-2 items-center relative">
            <Link
              to={`/${user?.username}`}
              className="bg-transparent px-1 py-1 rounded-full w-10 h-10 cursor-pointer hover:bg-gray-200"
            >
              <img
                className="object-cover rounded-full w-full h-full"
                src={user?.profile_pic}
                alt="profile"
              />
            </Link>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-transparent flex justify-center items-center px-2 py-2 rounded-full w-8 h-8 cursor-pointer hover:bg-gray-200"
            >
              <Down />
            </div>
            {showDropdown && (
              <div className="absolute top-full right-0 shadow-xl p-3 w-56 rounded-xl border border-gray-200 bg-white z-50">
                <header className="mb-3">
                  <p className="text-xs mb-2">Currently in</p>
                  <Link
                    to={`/${user?.username}`}
                    className="flex gap-2 hover:bg-gray-200 rounded-lg items-center py-2 px-1"
                    onClick={() => setShowDropdown(false)}
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user?.profile_pic}
                      alt="profile"
                    />
                    <div>
                      <h1 className="text-md font-semibold">{user?.name}</h1>
                      <span className="text-gray-700 text-xs">Personal</span>
                      <p className="text-gray-700 text-xs font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </Link>
                </header>
                <main>
                  <p className="text-xs mb-2 px-2">More options</p>
                  <ul>
                    <li>
                      <Link
                        to="/settings"
                        className="text-sm font-semibold block w-full hover:bg-gray-200 cursor-pointer py-2 px-2 rounded-md text-left"
                        onClick={() => setShowDropdown(false)}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logoutUser}
                        className="text-sm font-semibold block w-full hover:bg-gray-200 cursor-pointer py-2 px-2 rounded-md text-left"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </main>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
