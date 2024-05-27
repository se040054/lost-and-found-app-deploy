import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/items`

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

export const getItems = async ({ page = 1, category = null, search = null }) => {
  try {
    const { data } = await axios.get(`${apiBaseURL}`, {
      params: {
        page,
        category,
        search
      }
    })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

export const postItem = async (form) => {
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


export const getItem = async (id) => {
  try {
    console.log(apiBaseURL)
    const { data } = await axios.get(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}


export const editItem = async ({ id, form }) => {
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


export const deleteItem = async (id) => {
  try {
    const { data } = await tokenInstance.delete(`${apiBaseURL}/${id}`)
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}