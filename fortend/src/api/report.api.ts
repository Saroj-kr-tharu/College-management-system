import api from "./";

// gen report 
export const genReport = async (email: any) => {
  try {
    const response = await api.get(`/report/${email}`);

    console.log("res => ", response);

    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
