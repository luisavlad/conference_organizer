import apiClient from "./axiosConfig";

const conferenceRequests = {
  async getAll() {
    const response = await apiClient.get("/conferences");
    return response.data.data.conferences;
  },
};

export default conferenceRequests;
