import apiClient from "./axiosConfig";

const conferenceRequests = {
  async getAll() {
    const response = await apiClient.get("/conferences");
    return response.data.data.conferences;
  },

  async create(conferenceData) {
    const response = await apiClient.post("/conferences", conferenceData);
    return response.data.data.conference;
  },
};

export default conferenceRequests;
