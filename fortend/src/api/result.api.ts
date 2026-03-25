import type { IResult, ICreateResultPayload } from "../types/result.types";
import api from "./";

// Create a Result (marks array is sent; cgpa & overallStatus are auto-calculated by backend)
export const postResult = async (data: ICreateResultPayload) => {
  try {
    const response = await api.post("/result", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};

// Get All Results (populated: student, class, marks.course)
export const getAllResult = async () => {
  try {
    const response = await api.get("/result");
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};

// Update Result (partial — only pass fields that can be changed directly on the Result doc)
export const updateResult = async (id: string, data: Partial<IResult>) => {
  try {
    const response = await api.patch(`/result/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};

// Delete Result (soft-delete — sets isActive: false)
export const deleteResult = async (id: string) => {
  try {
    const response = await api.delete(`/result/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};

// Get logged-in student's own results
export const getMyResult = async () => {
  try {
    const response = await api.get("/result/my");
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};


// Teacher - get all results
export const getAllResults = async () => {
  try {
    const response = await api.get("/result");
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};

// AdminTeacher - class report
export const getClassReport = async (classId: string, semester?: string) => {
  try {
    const params = new URLSearchParams();
    if (semester) params.append("semester", semester);
    const response = await api.get(`/result/class/${classId}?${params}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data ?? error;
  }
};
