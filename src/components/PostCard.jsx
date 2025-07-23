import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, content }) {
  // Function to strip HTML tags and limit content length
  const getCleanExcerpt = (html, length = 100) => {
    if (!html) return '';
    const plainText = html.replace(/<[^>]*>/g, '');
    return plainText.length > length 
      ? `${plainText.substring(0, length)}...` 
      : plainText;
  };

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-gray-800 rounded-xl overflow-hidden 
     shadow-sm  '>
        {featuredImage && (
          <div className='w-full h-48 overflow-hidden'>
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title}
              className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
            />
          </div>
        )}
        <div className='p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2 line-clamp-2'>{title}</h2>
          <p className='text-gray-600 mb-4 line-clamp-3'>
            {getCleanExcerpt(content)}
          </p>
          <div className='text-blue-600 font-medium hover:text-blue-800 transition-colors'>
            Read more →
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard