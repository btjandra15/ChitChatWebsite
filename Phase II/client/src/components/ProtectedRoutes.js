import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function ProtectedRoutes({ component: Component, ...rest}){
    return(
        <Route
            {...rest}
            render={(props) => {
                const token = cookies.get("TOKEN");

                if(token){
                    return <Component {...props}/>;
                }else{
                    return(
                        <Navigate
                            to={{
                                pathname: "/",
                                state: {
                                    from: props.location,
                                }
                            }}
                        />
                    )
                }
            }}
        />
    )
}