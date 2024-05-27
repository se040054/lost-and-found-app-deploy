import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/merchants`

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

export const postMerchant = async (form) => {
  try {
    const { data } = await tokenInstance.post(`${apiBaseURL}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data' //因為有file 記得改
      }
    })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

export const getMerchant = async (id) => {
  try {
    const { data } = await axios.get(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

export const editMerchant = async ({ id, form }) => {
  try {
    const { data } = await tokenInstance.put(`${apiBaseURL}/${id}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data' //因為有file 記得改
      }
    })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


export const deleteMerchant = async (id) => {
  try {
    const { data } = await tokenInstance.delete(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}