import { useMemo } from "react";

const useSortedVideo = (videos, sort) => {
    const sortedVideo= useMemo(()=>{
        if(sort){
            return [...videos].sort((a,b) => a[sort].localeCompare(b[sort]))
        }
        return videos
    }, [sort, videos])
    return sortedVideo
}

export const useVideo =(videos, sort,query) =>{
    const sortedVideos = useSortedVideo(videos, sort)
    const sortedAndSearchedVideos = useMemo(() =>{
        return sortedVideos.filter((video)=>{
           return video.snippet?.title?.toLowerCase().includes(query.toLowerCase())
        })
    },[query, sortedVideos])
    return sortedAndSearchedVideos
}