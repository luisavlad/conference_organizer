import apiClient from "./axiosConfig";

const commentRequests = {
  async getByArticleId(articleId) {
    const response = await apiClient.get(`/comments/article/${articleId}`);
    return response.data.data.comments;
  },

  async create(commentData) {
    const response = await apiClient.post("/comments", commentData);
    return response.data.data.comment;
  },
};

export default commentRequests;
