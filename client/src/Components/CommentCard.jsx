import React from "react";
import { Link } from "react-router-dom";

const CommentCard = ({ comment }) => {
  return (
    <div className="flex gap-5 my-2 pr-3">
      <div className="flex justify-center items-center w-10 h-10 pt-4">
        <img
          src={comment.user?.profile_pic}
          className="w-full rounded-full"
          alt={comment.user?.name}
        />
      </div>

      <div className="border border-gray-300 rounded-xl p-3 flex-1">
        <Link
          to={`/${comment.user?.username}`}
          className="text-sm font-semibold"
        >
          {comment.user?.name}
        </Link>
        <p className="text-sm"> {comment.comment} </p>
      </div>
    </div>
  );
};

export default CommentCard;
