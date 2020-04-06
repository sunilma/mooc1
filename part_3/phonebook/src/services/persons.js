import axios from 'axios';

const baseUrl = "/api/persons";

export const getAll = () => {
    return axios.get(baseUrl);
};

export const addOne = (person) => {
    return axios.post(baseUrl, person);
};

export const removeOne = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

export const updateOne = (id, number) => {
    return axios.put(`${baseUrl}/${id}`, {number: number});
}
