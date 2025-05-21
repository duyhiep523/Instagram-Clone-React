import UserComment from './UserComment';

function CommentList({ comments, onReply, level = 1 }) {
  // comments: mảng bình luận, mỗi comment có thể có replies (mảng)
  return (
    <div className="comment-list">
      {comments && comments.map((comment, index) => (
        <UserComment
          key={index}
          comment={comment}
          onReply={onReply}
          level={level}
        >
          {/* Render replies nếu có và chưa vượt quá 3 cấp */}
          {comment.replies && level < 3 && (
            <CommentList comments={comment.replies} onReply={onReply} level={level + 1} />
          )}
        </UserComment>
      ))}
    </div>
  );
}

export default CommentList;