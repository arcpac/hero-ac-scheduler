import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    activeUser: null,
    token: null,
    loginUser: () => { },
    logoutUser: () => { }
});
