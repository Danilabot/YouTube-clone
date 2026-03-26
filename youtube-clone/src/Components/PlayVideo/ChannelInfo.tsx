import { Link } from 'react-router-dom'
import { formatNumber } from '../../utils/formatNumber'
import { SubscribeButton } from '../SubscribeButton/SubscribeButton'
import type { YouTubeChannel } from '../../types/youtube'

interface ChannelInfoProps {
  channelId: string
  channelData: YouTubeChannel | undefined
}

const ChannelInfo = ({ channelId, channelData }: ChannelInfoProps) => (
  <div className="publisher">
    <Link to={`/channel/${channelId}`}>
      <img src={channelData?.snippet?.thumbnails?.default?.url ?? ''} alt="" />
    </Link>
    <div>
      <Link to={`/channel/${channelId}`}>
        <p>{channelData?.snippet?.title}</p>
      </Link>
      <span>
        {channelData ? formatNumber(channelData.statistics.subscriberCount) : '1M'} Subscribers
      </span>
    </div>
    <SubscribeButton channelId={channelId} />
  </div>
)

export default ChannelInfo
