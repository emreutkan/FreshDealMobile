// src/middleware/tokenMiddleware.ts
import {Middleware} from '@reduxjs/toolkit';
import {tokenService} from "@/src/services/tokenService";

const PUBLIC_ACTIONS = [
    // User input actions
    'user/setEmail',
    'user/setPhoneNumber',
    'user/setPassword',
    'user/setToken',
    'user/setName',
    'user/setPasswordLogin',
    'user/setSelectedCode',
    'user/setVerificationCode',
    'user/setStep',
    'user/setLoginType',
    'user/loginUser',
    'user/logout',
    'user/logoutThunk/pending',
    'user/logoutThunk/fulfilled',
    'user/logoutThunk/rejected',
    // Login/Register flow actions
    'user/loginUserThunk/pending',
    'user/loginUserThunk/fulfilled',
    'user/loginUserThunk/rejected',
    'user/registerUserThunk/pending',
    'user/registerUserThunk/fulfilled',
    'user/registerUserThunk/rejected',

    // Auth state actions
    'user/logout',

    // Button/UI interaction actions
    'SUBMIT',
    'PRESS',
    'CLICK',
    'TOUCH'

];

export const tokenMiddleware: Middleware = (store) => (next) => (action) => {
    // Check if action type includes any of the public action patterns
    const isPublicAction = PUBLIC_ACTIONS.some(publicAction =>
        action.type.includes(publicAction)
    );

    if (isPublicAction) {
        return next(action);
    }

    // For protected actions, check token
    const token = tokenService.getToken();

    if (!token) {
        // Only dispatch logout if we're not already logging out
        if (action.type !== 'user/logout') {
            store.dispatch({type: 'user/logout'});
        }
        return;
    }

    return next(action);
};