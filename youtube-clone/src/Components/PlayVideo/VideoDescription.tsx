import { formatNumber } from '../../utils/formatNumber'

interface VideoDescriptionProps {
  description: string
  commentCount: string
}

const VideoDescription = ({ description, commentCount }: VideoDescriptionProps) => (
  <div className="vid-description">
    <p>{description.slice(0, 250)}</p>
    <hr />
    <h4>{formatNumber(commentCount)} Comments</h4>
  </div>
)

export default VideoDescription
