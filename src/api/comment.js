
import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/comments`

const tokenInstance = axios.create({
  baseURL: apiBaseURL,
});

tokenInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('apiToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
}, function (error) {
  return Promise.reject(error);
});


export const postComment = async ({ itemId, text }) => {
  try {
    const { data } = await tokenInstance.post(`${apiBaseURL}/${itemId}`, { text })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

export const deleteComment = async (id) => {
  try {
    const { data } = await tokenInstance.delete(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}