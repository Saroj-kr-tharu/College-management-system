import axios from "axios";
import api from "./";

// Create teacher (FormData for profile upload)
export const postTeacher = async (data: FormData) => {
  try {
    const response = await api.post("/teacher", data, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get all teachers
export const getAllTeachers = async (
  page: number,
  perPage: number,
  params?: { query: string; department?: string },
) => {
  try {
    const response = await api.get(
      `/teacher?current_page=${page}&per_page=${perPage}`,
      {
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get all teachers list used in all forms
export const getAllTeachersList = async () => {
  try {
    const response = await api.get("/teacher/all");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get teacher by ID
export const getTeacherById = async (id: string) => {
  try {
    const response = await api.get(`/teacher/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Get teacher by Email
export const getTeacherByEmail = async (email: any) => {
  try {
    const response = await api.get(`/teacher/email/${email}`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Update teacher
export const updateTeacher = async ({
  _id,
  formData,
}: {
  _id: string;
  formData: FormData;
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/teacher/${_id}`, formData, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Delete teacher
export const deleteTeacher = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/teacher/${id}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const updateTeacherProfile = async (email: string, formData: FormData) => {
  const encodedEmail = encodeURIComponent(email);
  const res = await axios.put(`/api/teacher/self/${encodedEmail}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
