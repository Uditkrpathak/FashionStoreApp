import axios from 'axios';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const token = localStorage.getItem('admin_token');
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      console.error('🚨 [ADMIN API ERROR DEBUG]', {
        endpoint: baseUrl + url,
        method,
        status: err.response?.status,
        responseBody: err.response?.data,
        errorMessage: err.message,
        fullErrorObj: err
      });
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
