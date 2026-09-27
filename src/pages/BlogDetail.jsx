import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [commentText, setCommentText] = useState("");
    const { token, user } = useAuth();

    const fetchBlog = () => {
        API.get(`/blogs/${id}`).then((res) => setBlog(res.data.data));
    };

    useEffect(() => { fetchBlog(); }, [id]);

    const handleLike = async () => {
        if (!token) return alert("Please login to like");
        await API.post(`/blogs/${id}/like`);
        fetchBlog();
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!token) return alert("Please login to comment");
        if (!commentText.trim()) return;
        await API.post(`/blogs/${id}/comment`, { text: commentText });
        setCommentText("");
        fetchBlog();
    };

    const handleShare = async () => {
        await API.post(`/blogs/${id}/share`);
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
        fetchBlog();
    };

    if (!blog) return <p className="status-msg">Loading...</p>;

    const liked = user && blog.likes?.includes(user.id);

    return (
        <div className="blog-detail">
            {blog.mediaUrl && blog.mediaType === "video" ? (
                <video src={blog.mediaUrl} controls className="detail-media" />
            ) : blog.mediaUrl ? (
                <img src={blog.mediaUrl} alt={blog.title} className="detail-media" />
            ) : null}

            <h1>{blog.title}</h1>
            <p className="author">By {blog.author?.name}</p>
            <p className="description">{blog.description}</p>

            <div className="actions">
                <button onClick={handleLike} className={liked ? "active" : ""}>
                    ❤️ {blog.likes?.length || 0}
                </button>
                <button onClick={handleShare}>🔗 Share ({blog.shareCount || 0})</button>
            </div>

            <div className="comments-section">
                <h3>Comments ({blog.comments?.length || 0})</h3>
                {token && (
                    <form onSubmit={handleComment} className="comment-form">
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                )}
                {blog.comments?.slice().reverse().map((c, i) => (
                    <div key={i} className="comment">
                        <strong>{c.user?.name || "User"}:</strong> {c.text}
                    </div>
                ))}
            </div>
        </div>
    );
}