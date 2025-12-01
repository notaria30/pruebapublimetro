import api from "./api";

export const getUsers = () => api.get("/auth/users");
