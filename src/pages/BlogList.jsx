import { useEffect, useState } from "react";
import API from "../api/axios";
import BlogCard from "../ components/BlogCard";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/blogs")
            .then((res) => setBlogs(res.data.data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="status-msg">Loading blogs...</p>;
    if (blogs.length === 0) return <p className="status-msg">No blogs yet.</p>;

    return (
        <div className="blog-grid">
            {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
            ))}
        </div>
    );
}