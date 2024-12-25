import http from "../http-common";

class CartDataService 
{
    getAllCartItems(id){
        return http.get(`/users/cart/items/${id}`);
    }
}

export default new CartDataService();