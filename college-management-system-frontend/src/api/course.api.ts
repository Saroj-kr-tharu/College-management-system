import api from './';
import type { ICourseData, ICourseResponse } from '../types/course.types';

// Create a course
export const postCourse = async (data: ICourseData) => {
    try {
        const response = await api.post('/course', data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get all courses
export const getAllCourses = async (page:number, perPage:number, params?:{query:string}) => {
    try {
        const response = await api.get(`/course?current_page=${page}&per_page=${perPage}`,{
            params
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get all courses list used in all forms
export const getAllCoursesList = async () => {
    try {
        const response = await api.get('/course/all');
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get course by ID
export const getCourseById = async (id: string) => {
    try {
        const response = await api.get(`/course/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Update a course
export const updateCourse = async ({ _id, ...data } : Partial<ICourseResponse>) => {
    try {
        const response = await api.put(`/course/${_id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Delete a course
export const deleteCourse = async (id: string) => {
    try {
        const response = await api.delete(`/course/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};
