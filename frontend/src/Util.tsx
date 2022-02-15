import axios from 'axios';
import CryptoJS from 'crypto-js';
import { UserResult } from './models/IUser';
                        
export const encryptData = (data:any, salt:string) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();


export const decryptData = (ciphertext:string, salt:string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
    try {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    catch(err){
        return null;
    }
}

//user obj control
export const control = () => {

    const localUser = localStorage.getItem("user")
    if ( localUser ) {
        const key = process.env.REACT_APP_SALT
        const decrypt = decryptData(localUser, key!)
        if ( decrypt !== null ) {
            try {
                const usr:UserResult = decrypt
                return usr
            } catch (error) {
                localStorage.removeItem("user")
                return null
            }
        }else {
            localStorage.removeItem("user")
            return null
        }
    }else {
        return null
    }

}

// aut control
export const autControl = () => {
    const stLocal = localStorage.getItem("auth")
    if ( stLocal ) {
        const key = process.env.REACT_APP_SALT
        const decrypt = decryptData(stLocal, key!)
        if ( decrypt !== null ) { 
            try {
                return decrypt;
            } catch (error) {
                return null;
            }
        }else {
            return null; 
        }
    }else {
        return null;
    }
}

export const fncDateConvert = (time:number) : string =>  {
    let dt = new Date(time)
    if ( time === 0 ) {
        dt = new Date()
    }
    return (dt.getDate() > 9 ? dt.getDate() : "0"+dt.getDate() ) + "." + ((dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : "0" +( dt.getMonth() + 1)) + "." + dt.getFullYear()
}