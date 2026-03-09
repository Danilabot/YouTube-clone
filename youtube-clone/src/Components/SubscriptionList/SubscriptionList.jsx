import { useEffect, useState } from 'react'
import { API_KEY } from '../../utils/data'
import styles from './SubscriptionList.module.css'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

export const SubscriptionList = () => {
  const user = useAppSelector(state => state.auth.user)
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [channelsInfo,setChannelsInfo]=useState([])

  const token = localStorage.getItem('token')
  const fetchSubscriptions = () => {
    if (!user) return

    fetch(`http://localhost:5000/api/subscriptions/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data)
        fetchChannelsInfo(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Ошибка загрузки подписок:', error)
        setLoading(false)
      })
  }
   const fetchChannelsInfo = async (subs) => {
    try {
        const promises = subs.map(sub => 
        fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${sub.channelId}&key=${API_KEY}`)
          .then(res => res.json())
          .then(data => data.items[0])
        )
        const channels = await Promise.all(promises)
        setChannelsInfo(channels.filter(ch => ch))
        setLoading(false)
    } catch (error) {
        console.error('Ошибка загрузки каналов:', error)
        setLoading(false)
    }
   }

  useEffect(() => {
    if (user) {
      fetchSubscriptions()
    } else {
      setSubscriptions([])
      setChannelsInfo([])
      setLoading(false)
    }
  }, [user])

  if(loading) return <div> Loading.....</div>
  return (
   <div className={styles.subscriptions}>
      
      {!user || channelsInfo.length === 0 ? (
        <p className={styles.empty}>Нет подписок</p>
      ) : (
        <ul className={styles.list}>
          {channelsInfo.map((channel) => (
            <li key={channel.id} className={styles.item}>
              <Link to={`/channel/${channel.id}`} className={`${styles.link} side-link`}>
                <img 
                  src={channel.snippet.thumbnails.default.url} 
                  alt={channel.snippet.title}
                  className={styles.avatar}
                />
                <p className={styles.name}>{channel.snippet.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
