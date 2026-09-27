import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
    return (
        <Link to={`/blog/${blog._id}`} className="blog-card">
            {blog.mediaUrl && blog.mediaType === "video" ? (
                <video src={blog.mediaUrl} className="blog-media" muted />
            ) : blog.mediaUrl ? (
                <img src={blog.mediaUrl} alt={blog.title} className="blog-media" />
            ) : null}
            <div className="blog-card-body">
                <h3>{blog.title}</h3>
                <p>{blog.description.slice(0, 100)}...</p>
                <div className="blog-meta">
                    <span>❤️ {blog.likes?.length || 0}</span>
                    <span>💬 {blog.comments?.length || 0}</span>
                    <span>🔗 {blog.shareCount || 0}</span>
                </div>
            </div>
        </Link>
    );
}