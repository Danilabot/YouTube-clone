import Sidebar from '../../Components/Sidebar/Sidebar'
import Feed from '../../Components/Feed/Feed'
import './Home.css'
import { useState } from 'react'

export const Home = ({sidebar, data, category, setCategory}) => {




  return (
    <>
      <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />
      <div className={`container ${sidebar?"":'large-container'}`} >
        <Feed data={data} />
      </div>
    </>
  )
}
