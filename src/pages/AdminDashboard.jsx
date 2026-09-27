import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
    const [blogs, setBlogs] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", mediaUrl: "", mediaType: "none" });
    const [editingId, setEditingId] = useState(null);

    const fetchBlogs = () => {
        API.get("/blogs").then((res) => setBlogs(res.data.data));
    };

    useEffect(() => { fetchBlogs(); }, []);

    const resetForm = () => {
        setForm({ title: "", description: "", mediaUrl: "", mediaType: "none" });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/blogs/${editingId}`, form);
            } else {
                await API.post("/blogs", form);
            }
            resetForm();
            fetchBlogs();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    const handleEdit = (blog) => {
        setForm({
            title: blog.title,
            description: blog.description,
            mediaUrl: blog.mediaUrl || "",
            mediaType: blog.mediaType || "none"
        });
        setEditingId(blog._id);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this blog?")) return;
        await API.delete(`/blogs/${id}`);
        fetchBlogs();
    };

    return (
        <div className="admin-dashboard">
            <h2>{editingId ? "Edit Blog" : "Create Blog"}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <input
                    placeholder="Media URL (image/gif/video link)"
                    value={form.mediaUrl}
                    onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                />
                <select
                    value={form.mediaType}
                    onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                >
                    <option value="none">None</option>
                    <option value="image">Image</option>
                    <option value="gif">GIF</option>
                    <option value="video">Video</option>
                    <option value="url">URL</option>
                </select>
                <div className="form-buttons">
                    <button type="submit">{editingId ? "Update" : "Create"}</button>
                    {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
                </div>
            </form>

            <h2>All Blogs</h2>
            <div className="admin-blog-list">
                {blogs.map((blog) => (
                    <div key={blog._id} className="admin-blog-row">
                        <span>{blog.title}</span>
                        <div>
                            <button onClick={() => handleEdit(blog)}>Edit</button>
                            <button onClick={() => handleDelete(blog._id)} className="danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}