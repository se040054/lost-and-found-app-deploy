import axios from "axios";

const apiBaseURL = `${process.env.REACT_APP_API_BASE_URL}/users`

export const apiGoogleLogin = async ({ email, name, avatar }) => {
  try {
    const { data } = await axios.post(`${apiBaseURL}/googleLogin`, {
      email, name, avatar: avatar || null
    })
    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }

}