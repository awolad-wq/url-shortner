import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});
const useAxios = () => {

    return axiosInstance;
};

export default useAxios;