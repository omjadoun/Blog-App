import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-10 bg-gray-100 min-h-screen">
            <Container>
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                        {/* Image Section */}
                        <div className="w-full lg:w-2/3">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-auto rounded-xl object-contain max-h-[400px]"
                            />
                        </div>

                        {/* Author Controls */}
                        {isAuthor && (
                            <div className="flex lg:flex-col gap-3 lg:ml-auto">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <button className="w-10 h-10 rounded-md bg-green-600 hover:bg-green-700 text-white transition">
                                        ✏️
                                    </button>
                                </Link>
                                <button
                                    onClick={deletePost}
                                    className="w-10 h-10 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                                >
                                    🗑️
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Post Title */}
                    <div className="mt-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-lg max-w-none text-gray-700 mt-4">
                        {parse(post.content)}
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}
