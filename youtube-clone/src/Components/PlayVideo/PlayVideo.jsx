import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import LikeButton from '../LikeButton/LikeButton'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { useEffect, useState } from 'react'
import { API_KEY, value_converter } from '../../utils/data'
import { formatDistanceToNow } from 'date-fns'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { SubscribeButton } from '../SubscribeButton/SubscribeButton'
import styles from '../SubscribeButton/SubscribeButton.module.css'
console.log('styles:', styles)

const PlayVideo = ({ likes, liked, handleLike }) => {
  const { videoId,channelId } = useParams()
  const [apiData, setApiData] = useState(null)
  const [channelData, setChannelData] = useState(null)
  const [commentData, setCommentData] = useState([])

  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]))
  }

  const fetchOtherData = async () => {
    // Fetching Channel Data
    const channelData_url = ` https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
    await fetch(channelData_url)
      .then((res) => res.json())
      .then((data) => setChannelData(data.items[0]))

    //Fetching Comment Data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
    await fetch(comment_url)
      .then((res) => res.json())
      .then((data) => setCommentData(data.items))
  }

  useEffect(() => {
    fetchVideoData()
  }, [videoId])
useEffect(() => {
  console.log('apiData ИЗМЕНИЛСЯ:', apiData)
  console.log('channelId ВНУТРИ apiData:', apiData?.snippet?.channelId)
}, [apiData])
  useEffect(() => {
    fetchOtherData()
  }, [apiData])

  return (
    
    <div className="play-video">
      {console.log('apiData полный:', apiData)}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : 'Title here'}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : '16k'}{' '}
          Views &bull;{' '}
          {apiData
            ? formatDistanceToNow(new Date(apiData.snippet.publishedAt), {
                addSuffix: true,
              })
            : ''}
        </p>
        <div>
          <span>
            {/* <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : '155'} */}
            <LikeButton
              totalLikes={
                (apiData ? Number(apiData.statistics.likeCount) : '') + likes
              }
              liked={liked}
              onLike={handleLike}
            />
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <Link to={`/channel/${apiData?.snippet?.channelId }`}>
          <img
            src={channelData ? channelData.snippet.thumbnails.default.url : ''}
            alt=""
          />
        </Link>
        <div>
          <Link to={`/channel/${apiData?.snippet?.channelId}`}>
            <p>{apiData?.snippet?.channelTitle}</p>
          </Link>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : '1M'}{' '}
            Subscribers
          </span>
        </div>
        <div>channelId: {channelId}</div>
 {apiData && apiData.snippet && apiData.snippet.channelId ? (
  <SubscribeButton channelId={apiData.snippet.channelId} />
) : (
  <div>Кнопка не может быть отображена</div>
)}
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : 'Description Here'}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : ''}{' '}
          Comments
        </h4>
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{' '}
                  <span>1 days ago</span>
                  <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                  <div className="comment-action">
                    <img src={like} alt="" />
                    <span>
                      {value_converter(
                        item.snippet.topLevelComment.snippet.likeCount,
                      )}
                    </span>
                    <img src={dislike} alt="" />
                  </div>
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayVideo
