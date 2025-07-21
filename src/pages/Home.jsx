import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard } from '../components'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

function Home() {
    const [posts, setPosts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)

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

    if (posts.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
                <Container>
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md text-center">
                        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to DevBlog</h1>
                        <p className="text-gray-600 mb-6">There are no posts yet. Be the first to create one!</p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="py-12 bg-gray-50">
            <Container>
                <div className="max-w-2xl mx-auto mb-12 relative">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-6 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                    
                    {showSuggestions && searchQuery.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">All</h3>
                                {searchResults.length > 0 ? (
                                    <ul>
                                        {searchResults.slice(0, 5).map((post) => (
                                            <li key={post.$id} className="py-2 hover:bg-gray-50 px-2 rounded">
                                                <Link 
                                                    to={`/post/${post.$id}`} 
                                                    className="block"
                                                    onClick={() => setShowSuggestions(false)}
                                                >
                                                    {post.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 py-2">No results found</p>
                                )}
                            </div>
                            <div className="border-t border-gray-200 p-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Technology', 'Design', 'Business', 'Lifestyle'].map((category) => (
                                        <button 
                                            key={category}
                                            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
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

                <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
                    {searchQuery.length > 0 ? 'Search Results' : 'Featured Stories'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayPosts.map((post) => (
                        <div key={post.$id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <PostCard {...post} />
                            <div className="p-4">
                                <p className="text-sm text-gray-500">
                                    Published: {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {displayPosts.length === 0 && searchQuery.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No posts found matching your search.</p>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home