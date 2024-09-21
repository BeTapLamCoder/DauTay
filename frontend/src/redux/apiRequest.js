import axios from "axios";
import {loginStart,registerStart} from "./authSlice";
import { loginSuccess,registerSuccess } from "./authSlice";
import { loginFailed,registerFailed } from "./authSlice";
import { getUsersFailed, getUsersSuccess, getUsersStarts, deleteUserStart, deleteUserSuccess, deleteUserFailed } from "./userSlice";
export const loginUser = async(user, dispatch, navigate) =>{
    dispatch(loginStart());
    try{
        
        const res = await axios.post("/v1/auth/login",user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    }catch{
        dispatch(loginFailed());
    }
}
export const registerUser = async(user, dispatch, navigate)=>{
    dispatch(registerStart());
    try{
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    }catch{
        dispatch(registerFailed());
    }
}

export const getAllUsers = async (accessToken,dispatch,axiosJWT) =>{
    
    try{
        const res = await axiosJWT.get("/v1/user",{
            headers: {token: `Bearer ${accessToken}`},
        } );
        dispatch(getUsersSuccess(res.data));
    }
    catch(err){
        dispatch(getUsersFailed());
    }
};
export const deleteUser = async(accessToken,dispatch, id)=>{
    dispatch(deleteUserStart());
    try{
        const res = await axios.delete("/v1/user" + id, {headers: {token: `Bearer ${accessToken}`},})
        dispatch(deleteUserSuccess(res.data));
    }
    catch(err){
        dispatch(deleteUserFailed(err.res.data));

    }
}