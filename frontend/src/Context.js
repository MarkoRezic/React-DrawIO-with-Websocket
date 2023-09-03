import React from 'react';
import { useState, createContext, useEffect } from 'react';
import axios from './axios';

export const DataContext = createContext();

export const DataProvider = (props) => {

    const {
        user,
        setUser,
        register,
        login,
        logout,
        updateUsername,
        updateAvatar,
    } = useProviderFunctions()

    return (
        <DataContext.Provider value={
            {
                user,
                setUser,
                register,
                login,
                logout,
                updateUsername,
                updateAvatar,
            }
        }>
            {props.children}
        </DataContext.Provider>
    );
}

const useProviderFunctions = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const localUser = localStorage.getItem("user");
        if (localUser == null && window.location.pathname !== '/login') {
            window.location.replace('/login')
        }
        else if (user == null && localUser != null) {
            setUser(JSON.parse(localUser))
        }
        else if (user != null && localUser != null && window.location.pathname === '/login') {
            window.location.replace('/')
        }
    }, [user, setUser])

    const login = (username, password, errorCallback) => {
        axios.post('users/login', {
            username,
            password,
        }).then((response) => {
            console.log(response);
            localStorage.setItem("user", JSON.stringify(response?.data?.user));
            setUser(response?.data?.user);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const register = (username, password, errorCallback) => {
        axios.post('users/register', {
            username,
            password
        }).then((response) => {
            console.log(response);
            login(username, password);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const updateUsername = (username, callback, errorCallback) => {
        axios.put(`users/username/${user.user_id}`, {
            username
        }).then((response) => {
            console.log(response);
            console.log(username);
            console.log({ ...user, username: username });
            localStorage.setItem("user", JSON.stringify({ ...user, username }));
            setUser({ ...user, username });
            callback(response);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const updateAvatar = (avatar, callback, errorCallback) => {
        axios.put(`users/avatar/${user.user_id}`, {
            avatar
        }).then((response) => {
            console.log(response);
            localStorage.setItem("user", JSON.stringify({ ...user, avatar }));
            setUser({ ...user, avatar });
            callback(response);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const logout = () => {
        localStorage.removeItem("user")
        setUser(null);
    }

    return {
        user,
        setUser,
        register,
        login,
        logout,
        updateUsername,
        updateAvatar,
    }

}