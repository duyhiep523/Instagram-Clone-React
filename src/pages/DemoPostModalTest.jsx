import React, { useState } from "react";
import PostModal, { demoPost } from "../Modal/Post/PostModal";

export default function DemoPostModalTest() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ minHeight: "100vh", background: "#18191a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={() => setShow(true)} style={{position:'fixed',top:30,left:30,zIndex:999}}>Mở PostModal demo</button>
      {show && (
        <PostModal post={demoPost} onClose={() => setShow(false)} />
      )}
    </div>
  );
}
