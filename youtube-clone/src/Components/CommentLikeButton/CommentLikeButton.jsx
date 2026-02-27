import { useState } from "react"

export const CommentLikeButton = ({commentId, initialLikes}) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(initialLikes || 0)
    const [loading, setLoading] = useState(false)
    
    const token = localStorage.getItem('token')


  return (
    <div>
        <h1>{likesCount}</h1>
        <button>click</button>
        console.log(token)
    </div>
  )
}
