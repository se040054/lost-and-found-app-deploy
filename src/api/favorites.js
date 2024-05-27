import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/favorites`

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

export const getMyFavorites = async () => {
  try {
    const { data } = await tokenInstance.get(`${apiBaseURL}/mine`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }

}

export const postFavorite = async (itemId) => {
  try {
    const { data } = await tokenInstance.post(`${apiBaseURL}/${itemId}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }

}

export const deleteFavorite = async (itemId) => {
  try {
    const { data } = await tokenInstance.delete(`${apiBaseURL}/${itemId}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }

} 