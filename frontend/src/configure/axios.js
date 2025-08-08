import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:'http://localhost:5001/api',  //base url
    headers:{
        "Content-Type":"application/json"  //defafult content type
    },
    withCredentials:true  // pass cookie and token in api
})

export default axiosInstance