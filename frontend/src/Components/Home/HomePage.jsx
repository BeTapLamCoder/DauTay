import { useEffect } from "react";
import "./home.css";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {useDispatch, useSelector} from "react-redux";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import axios from "axios";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  //DUMMY DATA
  
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state)=> state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);
  let axiosJWT = axios.create();
  const dispatch = useDispatch();
  const naivgate = useNavigate();
  const userData = [
    {
      username: "anhduy1202",
    },
    {
      username: "kelly1234",
    },
    {
      username: "danny5678",
    },
    {
      username: "kenny1122",
    },
    {
      username: "jack1234",
    },
    {
      username: "loi1202",
    },
    {
      username: "nhinhi2009",
    },
    {
      username: "kellynguyen1122",
    },
    
  ];
  

  const refreshToken = async()=>{
    try{
      const res = await axios.post("/v1/auth/refresh",{
        withCredentials: true
      } );
     return res.data;
    }
    catch{

    }
  }
  axiosJWT.interceptors.request.use(
    async(config) =>{
      let date = new Date();
      const decodeToken = jwt_decode(user?.accessToken);
      if(decodeToken.exp < date.getTime()/1000 ){
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,

        };
        dispatch(loginSuccess(refreshUser));
        config.header["token"] = "Bearer" + data.accessToken;
      }
      return config;
    },
    (err) =>{
      return Promise.reject(err);
    }
  );
  useEffect(()=>{
    if(!user){
      navigate("/login");
    }
    if(user?.accessToken){
      getAllUsers(user?.accessToken, dispatch), axiosJWT;
    }
    
    
  },[]);
  const handleDelete =(id)=>{
    deleteUser(user?.accessToken, dispatch,id);
  };
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? `Admin` : `User`} `}
      </div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() =>handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>
      <div className="errMsg">{msg}</div>
    </main>
  );
};

export default HomePage;
