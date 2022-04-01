import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MasonryLayout from "../Components/MasonryLayout";
import Spinner from "../helpers/Spinner";
import { fetchPins } from "../redux/actions/pinActions";

const Home = () => {
  const dispatch = useDispatch();

  const { pins } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  return (
    <div className="pt-24">
      <div className="flex items-start justify-center gap-2 min-h-[calc(100vh-80px)]">
        {pins.loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-80px)] w-full">
            <Spinner color={"#000"} size={3} />
          </div>
        ) : (
          <MasonryLayout pins={pins.pins} />
        )}
      </div>
    </div>
  );
};

export default Home;
