
import React from 'react'

function Logo({width = '100px'}) {
  return (
    <div className="font-bold text-2xl text-blue-600" style={{width}}>
      Dev<span className="text-orange-500">Blog</span>
    </div>
  )
}

export default Logo
