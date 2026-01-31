import type { IStudentData } from '../types/student.types';
import api from './';

// Create student (FormData for profile upload)
export const postStudent = async (data: FormData) => {
    try {
        const response = await api.post('/student', data, {
            headers: {
            'x-access-token': localStorage.getItem('token') || ''
            }
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get all students
export const getAllStudents = async (page:number, perPage:number, params?:{query:string}) => {
    try {
        const response = await api.get(`/student?current_page=${page}&per_page=${perPage}`,{
            params
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get all students list used in all forms
export const getAllStudentsList = async () => {
    try {
        const response = await api.get('/student/all');
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get student by ID
export const getStudentById = async (id:string) => {
    try {
        const response = await api.get(`/student/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Update student
export const updateStudent = async ({ _id, formData } : { _id: string, formData: FormData }) => {
    try {
        const response = await api.put(`/student/${_id}`, formData);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Delete student
export const deleteStudent = async (id:string) => {
    try {
        const response = await api.delete(`/student/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get Students in Chart
export const getStudents = async (): Promise<IStudentData[]> => {
    try {
        const response = await api.get('/student/chart');
        return response.data.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

// Get Students By Class
export const getStudentsByClass = async (classId: string) => {
    try {
        const response = await api.get(`/student/class/${classId}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};


// getallStudentbyfilter
export const getAllStudentFilter = async (page:number, perPage:number, data:any) => {
    try {
        console.log("data : ", data)
        const response = await api.post(`/student/filter?current_page=${page}&per_page=${perPage}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};
