import React from "react";

export default function UserHeader({ loading, user }) {
  if (loading || !user) {
    return (
      <div
        className="post-caption insta-title-row"
        style={{
          marginBottom: 8,
          marginTop: 0,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          flexDirection: "row",
        }}
      >
        <div
          className="skeleton-image"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            marginRight: 12,
            marginTop: 2,
          }}
        ></div>
        <div>
          <div
            className="skeleton-image"
            style={{ width: 100, height: 16, marginBottom: 6 }}
          ></div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="post-caption insta-title-row"
      style={{
        marginBottom: 8,
        marginTop: 0,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        flexDirection: "row",
      }}
    >
      <img
        src={
          user.profilePictureUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/1/12/230601_Karina_%28aespa%29.jpg"
        }
        alt="Avatar"
        loading="lazy"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: 12,
          marginTop: 2,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          gap: 4,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.2,
            wordBreak: "break-all",
            marginBottom: 2,
          }}
        >
          <a
            href={`/user/${user.username}`}
            style={{
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.2,
              wordBreak: "break-all",
              marginBottom: 2,
              textDecoration: "none",
            }}
          >
            {user.username}
          </a>
        </span>
        <span
          style={{
            color: "#ccc",
            fontSize: 14,
            lineHeight: 1.1,
            wordBreak: "break-all",
            marginBottom: 2,
          }}
        >
          {user.fullName}
        </span>
      </div>
    </div>
  );
}
