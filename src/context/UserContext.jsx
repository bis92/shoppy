import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            updateUser(user)
        } else {
            updateUser(null);
        }
        });
    }, [])
    const [user, setUser] = useState(null);
    const updateUser = (updateUser) => setUser(updateUser);
    return <UserContext.Provider value={{user, updateUser}}>
        {children}
        </UserContext.Provider>
}
