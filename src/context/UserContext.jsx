import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const updateUser = (updateUser) => setUser(updateUser);
    return <UserContext.Provider value={{user, updateUser}}>
        {children}
        </UserContext.Provider>
}
