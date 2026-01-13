import apiClient from "./axiosConfig";

const userRequests = {
  async getAllReviewers() {
    const response = await apiClient.get("/users/reviewers");
    return response.data.data.reviewers;
  },
};

export default userRequests;
