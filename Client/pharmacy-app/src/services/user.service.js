import http from "../http-common";

class UserDataService {
    getAll() {
        return http.get('/users'); 
    }

    get(id) {
        return http.get(`/users/${id}`);
    }

    create(data) {
        return http.post('/users', data);
    }

    update(id, data) {
        return http.put(`/users/${id}`, data);
    }

    delete(id) {
        return http.delete(`/users/${id}`);
    }

    deleteAll() {
        return http.delete(`/users`);
    }

    deleteFromCart(id, data){
        return http.delete(`/users/${id}/cart`, { data });
    }

    addToCart(id, data){
        return http.post(`/users/${id}/cart/`, data);
    }

    createOrder(id){
        return http.post(`/users/${id}/order/`);
    }

    getAllCartItems(id){
        return http.get(`/users/cart/items/${id}`);
    }
}

export default new UserDataService();