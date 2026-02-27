import { useContext } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import { AuthContext } from '../../context/context'
import { Loader } from '../../UI/Loader/Loader'


export const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext)
    if(isLoading) {
        return <Loader/>
    }
  return isAuth ?(
    <Routes>
        {privateRoutes.map((route)=>{
            <Route
            Component={route.component}  
            path={route.path}
            exact={route.exact}
            key={route.path}
            />
        })}
    </Routes>
  )
}
