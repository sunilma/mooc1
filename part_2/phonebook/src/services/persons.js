import axios from 'axios';

const baseUrl = "http://localhost:3001/persons";

export const getAll = () => {
    return axios.get(baseUrl);
};

export const addOne = (person) => {
    return axios.post(baseUrl, person);
};

export const removeOne = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

export const updateOne = (id, person) => {
    return axios.put(`${baseUrl}/${id}`, person);
}
