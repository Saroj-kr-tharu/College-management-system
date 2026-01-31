import type { IAttendanceData, IAttendanceResponse } from '../types/attendance.types';
import api from './';

// Create attendance

export const postAttendance = async (data: IAttendanceData) : Promise<IAttendanceResponse> => {
    try {
        const response = await api.post<IAttendanceResponse>('/attendance', data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get all attendance records
export const getAllAttendance = async (page:number, perPage:number) => {
    try {
        const response = await api.get(`/attendance?current_page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get attendance by ID
export const getAttendanceById = async (id: string) => {
    try {
        const response = await api.get(`/attendance/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Update attendance
export const updateAttendance = async ({ _id, ...data } : Partial<IAttendanceData>) => {
    try {
        const response = await api.put(`/attendance/${_id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Delete attendance
export const deleteAttendance = async (id: string) => {
    try {
        const response = await api.delete(`/attendance/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};
