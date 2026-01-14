import apiClient from "./axiosConfig";

const articleRequests = {
  async getByConferenceId(conferenceId) {
    const response = await apiClient.get(
      `/articles/conference/${conferenceId}`
    );
    return response.data.data.articles;
  },

  async create(formData) {
    const response = await apiClient.post("/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.article;
  },
};

export default articleRequests;
