
import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/claims`

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

export const getClaim = async (itemId) => {
  try {
    const { data } = await tokenInstance.get(`${apiBaseURL}/${itemId}`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const postClaim = async (itemId) => {
  try {
    const { data } = await tokenInstance.post(`${apiBaseURL}/${itemId}`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getSubmittedClaims = async () => {
  try {
    const { data } = await tokenInstance.get(`${apiBaseURL}/submitted`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getReceivedClaims = async () => {
  try {
    const { data } = await tokenInstance.get(`${apiBaseURL}/received`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const putClaim = async ({ id, action }) => {
  try {
    const { data } = await tokenInstance.put(`${apiBaseURL}/${id}`, { action: action })
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteClaim = async (id) => {
  try {
    const { data } = await tokenInstance.delete(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}