import apiClient from "./axiosConfig";

const articleRequests = {
  async getByConferenceId(conferenceId) {
    const response = await apiClient.get(
      `/articles/conference/${conferenceId}`
    );
    return response.data.data.articles;
  },
};

export default articleRequests;
