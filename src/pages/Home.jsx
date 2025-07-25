import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard } from '../components'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import Masonry from 'react-masonry-css'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const authStatus = useSelector(state => state.auth.status)
    const navigate = useNavigate()

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)
        
        if (query.length > 0) {
            const results = posts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                (post.content && post.content.toLowerCase().includes(query))
            )
            setSearchResults(results)
            setShowSuggestions(true)
        } else {
            setSearchResults([])
            setShowSuggestions(false)
        }
    }

    const displayPosts = searchQuery.length > 0 ? searchResults : posts

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-800 via-gray-900 to-black">
                <Container>
                    <div className="max-w-xl mx-auto bg-gradient-to-b from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-md text-center">
                        <h1 className="text-3xl font-bold mb-4 text-white">Welcome to DevBlog</h1>
                        <p className="text-gray-400 mb-6">There are no posts yet. Be the first to create one!</p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    // If user is not logged in, show login prompt
    if (!authStatus) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-800 via-gray-900 to-black">
                <Container>
                    <div className="max-w-xl mx-auto bg-gradient-to-b from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-md text-center">
                        <h1 className="text-3xl font-bold mb-4 text-white">Welcome to DevBlog</h1>
                        <p className="text-gray-400 mb-6">Please login to view our featured stories</p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="py-8 bg-gradient-to-b from-gray-800 via-gray-900 to-black">
            <Container>
                <div className="max-w-2xl mx-auto mb-12 relative mt-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-6 py-3 pl-12 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        />
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                    
                    {showSuggestions && searchQuery.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 transition-all duration-900 hover:shadow-xl hover:shadow-blue-500/20">
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">All</h3>
                                {searchResults.length > 0 ? (
                                    <ul>
                                        {searchResults.slice(0, 5).map((post) => (
                                            <li 
                                                key={post.$id} 
                                                className="py-2 hover:bg-gray-700 px-2 rounded transition-all duration-200"
                                            >
                                                <Link 
                                                    to={`/post/${post.$id}`} 
                                                    className="block text-white hover:text-blue-400"
                                                    onClick={() => setShowSuggestions(false)}
                                                >
                                                    {post.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 py-2">No results found</p>
                                )}
                            </div>
                            <div className="border-t border-gray-700 p-4">
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Technology', 'Design', 'Business', 'Lifestyle'].map((category) => (
                                        <button 
                                            key={category}
                                            className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10"
                                            onClick={() => {
                                                setSearchQuery(category)
                                                setShowSuggestions(false)
                                            }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <h2 className="text-4xl font-bold mb-12 text-center text-white">
                    {searchQuery.length > 0 ? 'Search Results' : 'Featured Stories'}
                </h2>
                
                {/* Masonry Grid Layout */}
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex -ml-8 w-auto"
                    columnClassName="pl-8"
                >
                    {displayPosts.map((post) => (
                        <div 
                            key={post.$id} 
                            className="mb-8 bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 border border-gray-700 hover:border-blue-500/30"
                        >
                            <Link to={`/post/${post.$id}`} className="block">
                                <div className="w-full overflow-hidden">
                                    <img 
                                        src={appwriteService.getFilePreview(post.featuredImage)} 
                                        alt={post.title}
                                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">{post.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {post.content.replace(/<[^>]*>/g, '')}
                                    </p>
                                </div>
                            </Link>
                            <div className="p-4 border-t border-gray-700">
                                <p className="text-sm text-gray-400">
                                     {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </Masonry>

                {displayPosts.length === 0 && searchQuery.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No posts found matching your search.</p>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home