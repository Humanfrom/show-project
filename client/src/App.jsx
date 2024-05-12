import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Registration from "./pages/Registration";
import { useSelector, useDispatch } from "react-redux";
import { privateRoutes, publicRoutes, adminRoutes } from "./routes";
import { useEffect } from "react";
import { fetchUserData } from "./slices/userSlice";
import useToken from '@Utils/useToken';

function App() {
  const userStatus = useSelector(state => state.userStore.userStatus);
  const dispatch = useDispatch();
  const { token } = useToken();
  
  useEffect(() => {
    dispatch(fetchUserData({token}));
  },[]);

  let routes = publicRoutes;
  switch(userStatus){
      case 'user':
        routes = privateRoutes;
          break; 
      case 'admin':
        routes = adminRoutes;
  };

  return (
      <div className="app">
        <Navbar/>
          <Routes>
            {routes.map(route => <Route key={'rt' + route.id} path={route.path} Component={route.component}/>)}
          </Routes>
      </div>
  );
}

export default App;
