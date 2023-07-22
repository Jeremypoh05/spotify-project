import { useEffect, useState, createContext, useContext } from 'react';
import {
    useUser as useSupaUser,
    useSessionContext,
    User
} from '@supabase/auth-helpers-react';

import { UserDetails, Subscription } from '@/types';

// -------------------------custom context and a custom hook for managing user-related data in your application---------------------------

type UserContextType = {
    accessToken: string | null; // represents the access token of the user
    user: User | null; //: It represents the user object. It can either hold a user object or be null if the user is not authenticated.
    userDetails: UserDetails | null; //
    isLoading: boolean; //It represents the loading state of the user context
    subscription: Subscription | null;
};

//UserContext is a variable that represents a context object created using the createContext function from React

//createContext<UserContextType | undefined>(undefined) syntax specifies the type of the context object, which is UserContextType | undefined.
//It means that the context object can either hold a value of type UserContextType or be undefined.

//By creating this context object, you are establishing a way to share the UserContextType data (such as user details, access token, and subscription) 
//across multiple components in your React application. 
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any;
}

//MyUserContextProvider component is a custom context provider that manages the user-related data and states.
export const MyUserContextProvider = (props: Props) => {
    //extract the session, isLoadingUser, and supabase client from the session context.
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser(); //useSupaUser hook to get the user object, which represents the currently authenticated user.
    const accessToken = session?.access_token ?? null; // retrieves the access_token from the session object. If it exists, it is assigned to the accessToken variable; otherwise, null is assigned.
    const [isLoadingData, setIsloadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetails = () => supabase.from('users').select('*').single(); // function that retrieves the user details using the Supabase client's from method to query the "user" table and selects all columns.
    const getSubscription = () =>
    //function that retrieves the subscription information using the Supabase client's from method to query the "subscriptions" table, 
    //selecting all columns and expanding the nested "prices" and "products" data.
        supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            .single();

    //manage the asynchronous fetching of user details and subscription information. It has a dependency array that includes user 
    //and isLoadingUser variables, so it will run whenever these variables change.
    useEffect(() => {
        //If the user is authenticated (user exists) and the loading states (isLoadingData, userDetails, and subscription) are not active, the data fetching process is triggered. 
        //The isLoadingData state is set to true to indicate that data is being fetched.
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsloadingData(true);
            //Promise.allSettled used to fetch both the user details and subscription data concurrently.
            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    if (userDetailsPromise.status === 'fulfilled')
                        setUserDetails(userDetailsPromise.value.data as UserDetails);

                    if (subscriptionPromise.status === 'fulfilled')
                        setSubscription(subscriptionPromise.value.data as Subscription);

                    setIsloadingData(false);
                }
            );
            //If the user is not authenticated (user is falsy) and the loading states are not active, the userDetails and subscription states are reset to null.
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);

    //value object is created, which represents the context value. 
    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    //passing the value as the context value and forwarding any additional props using the spread operator.
    return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error(`useUser must be used within a MyUserContextProvider.`);
    }
    return context;
};