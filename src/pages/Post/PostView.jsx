import React from "react";
import PostModal from "../../Modal/Post/PostModal";
import { useState } from "react";
// ...
const PostView = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
     
      <button onClick={() => setShowModal(true)}>Xem bài viết</button>
      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default PostView;
