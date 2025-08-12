import axios from 'axios'



const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("base url",baseURL)

const axiosInstance=axios.create({
    // baseURL:'http://localhost:5001/api',  //base url
    baseURL,
    headers:{
        "Content-Type":"application/json"  //defafult content type
    },
    withCredentials:true  // pass cookie and token in api
})

export default axiosInstance