import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config"

function AllPosts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    return (
        <div className='w-full py-8'>
            <Container>
                <h1 className="text-3xl font-bold mb-8 text-center text-white">All Posts</h1>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4'>
                            <div className='h-full bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 border border-gray-700 hover:border-blue-500/30'>
                                <PostCard {...post} />
                                <div className='p-4'>
                                    <h2 className='text-xl font-bold text-white mb-2'>{post.title}</h2>
                                    <p className='text-gray-400 text-sm'>
                                         {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts