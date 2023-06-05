import { UserData } from "../typings/interface.js";
import jwt from "jsonwebtoken";
export function generateAccessToken(user:Omit<UserData,"password">,key:string,isRefresh=false){
    if(isRefresh) return jwt.sign(user,key,{expiresIn:"7d"});
    return jwt.sign(user,key);
}

export function generateRefreshToken(user:Omit<UserData,"password">,key:string){
    return jwt.sign(user,key);
}
