import apiClient from "./axiosConfig";

const articleRequests = {
  async getByConferenceId(conferenceId) {
    const response = await apiClient.get(
      `/articles/conference/${conferenceId}`
    );
    return response.data.data.articles;
  },

  async getById(articleId) {
    const response = await apiClient.get(`/articles/${articleId}`);
    return response.data.data.article;
  },

  async updateStatus(articleId, status) {
    const response = await apiClient.patch(`/articles/${articleId}/status`, {
      status,
    });
    return response.data.data.article;
  },

  async update(articleId, formData) {
    const response = await apiClient.patch(`/articles/${articleId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.article;
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
