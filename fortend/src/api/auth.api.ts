import type { IChangePassword, ILoginData, ISignupData } from '../types/auth.types';
import api from './';

export const login = async(data: ILoginData) => {
    try {
        
        // 1. api login hit 
        const response = await api.post(`/auth/login`, data);
        // console.log( "response => ", response?.data?.data);
        
        return response.data.data;
    } catch (error: any) {
        console.log(error);
        throw error.response.data;
    }
};

export const signup = async(data: ISignupData) => {
    try {
        const response = await api.post(`/auth/signup`, data);
        console.log(response);
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw error.response.data;
    }
};

export const getCurrentUser = async() => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/auth/me', {
            headers: {
            'x-access-token': token 
            }
        });
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw error.response.data;
    }
};

export const ChangePassword = async(data:IChangePassword ) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post('/auth/change-password', data, {
            headers: {
            'x-access-token': token 
            }
        });
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw error.response.data;
    }
};

export const logout = async() => {
    try {
        const response = await api.post(`/auth/logout`);
        console.log(response);
        localStorage.removeItem("token")
        
        return response.data
    } catch (error: any) {
        console.log(error);
        throw error.response.data;
    }
};
