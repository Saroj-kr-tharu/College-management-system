import axios from "axios";
import type { IStudentData } from "../types/student.types";
import api from "./";

// Create student (FormData for profile upload)
export const postStudent = async (data: FormData) => {
  try {
    const response = await api.post("/student", data, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get all students
export const getAllStudents = async (
  page: number,
  perPage: number,
  params?: { query: string; program?: string; semester?: string },
) => {
  try {
    const response = await api.get(
      `/student?current_page=${page}&per_page=${perPage}`,
      {
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get all students list used in all forms
export const getAllStudentsList = async () => {
  try {
    const response = await api.get("/student/all");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get student by ID
export const getStudentById = async (id: string) => {
  try {
    const response = await api.get(`/student/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get student by Email
export const getStudentByEmail = async (email: any) => {
  try {
    const response = await api.get(`/student/email/${email}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Update student
export const updateStudent = async ({
  _id,
  formData,
}: {
  _id: string;
  formData: FormData;
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/student/${_id}`, formData, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Delete student
export const deleteStudent = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/student/${id}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get next auto-increment roll number
export const getNextRollNumber = async () => {
  try {
    const response = await api.get("/student/next-roll-number");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get next auto-increment registration number
export const getNextRegistrationNumber = async () => {
  try {
    const response = await api.get("/student/next-registration-number");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// Get Students in Chart
export const getStudents = async (): Promise<IStudentData[]> => {
  try {
    const response = await api.get("/student/chart");
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
export const getAllStudentFilter = async (
  page: number,
  perPage: number,
  data: any,
) => {
  try {
    const response = await api.post(
      `/student/filter?current_page=${page}&per_page=${perPage}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const updateStudentProfile = async (email: string, formData: FormData) => {
  const encodedEmail = encodeURIComponent(email); // "amrit+0868@gmail.com" → "amrit%2B0868%40gmail.com"
  const res = await axios.put(`/api/student/self/${encodedEmail}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};