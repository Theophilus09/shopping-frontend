import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Adjust path if needed
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const signOut = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{ user, signOut, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);