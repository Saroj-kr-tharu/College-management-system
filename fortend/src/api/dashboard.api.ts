import api from "./";

export const dashboard = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/dashboard", {
      headers: {
        "x-access-token": token,
      },
    });
    console.log("dashboard => ", response.data);
    return response.data.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
