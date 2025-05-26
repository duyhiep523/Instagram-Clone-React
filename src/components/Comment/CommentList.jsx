import UserComment from './UserComment';
import React from 'react';

function CommentList({ comments, onReply, level = 1 }) {
  const maxRepliesShow = 2;
  return (
    <div className="comment-list" style={{ maxHeight: 440, overflowY: 'auto' }}>
      {(!comments || comments.length === 0) ? (
        <div style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', margin: '16px 0' }}>
          Chưa có người bình luận
        </div>
      ) : (
        comments.map((comment, index) => (
          <CommentWithShowReplies
            key={comment.id || index}
            comment={comment}
            onReply={onReply}
            level={level}
            maxRepliesShow={maxRepliesShow}
          />
        ))
      )}
    </div>
  );
}

function CommentWithShowReplies({ comment, onReply, level, maxRepliesShow }) {
  const [showAllReplies, setShowAllReplies] = React.useState(false);
  const replies = comment.replies || [];

  const effectiveLevel = Math.min(level, 3);

  const visibleReplies = showAllReplies ? replies : replies.slice(0, maxRepliesShow);

  return (
    <UserComment comment={comment} onReply={onReply} level={effectiveLevel}>
      {replies.length > 0 && (
        <>
          {visibleReplies.map((reply, idx) => (
            <CommentWithShowReplies
              key={reply.id || idx}
              comment={reply}
              onReply={onReply}
              level={level + 1} // không giới hạn cấp reply
              maxRepliesShow={maxRepliesShow}
            />
          ))}
          {!showAllReplies && replies.length > maxRepliesShow && (
            <div style={{ marginLeft: effectiveLevel * 24, marginTop: 4 }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3897f0',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: 0,
                  fontWeight: 500,
                }}
                onClick={() => setShowAllReplies(true)}
                tabIndex={0}
              >
                Xem câu trả lời ({replies.length})
              </button>
            </div>
          )}
        </>
      )}
    </UserComment>
  );
}

export default CommentList;