import http from "../http-common";

class MedDataService {
  getAll(sortOrder, departmentId) {
    // Создаем объект с параметрами запроса
    const params = {};
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    if (departmentId) {
      params.departmentId = departmentId;
    }
    
    return http.get('/meds', { params });  // Передаем параметры как часть запроса
  }

  get(id) {
    return http.get(`/meds/${id}`);
  }

  // Вместо передачи name напрямую, нужно передавать его в объекте params
  search(name, departmentId) {
    return http.get('/meds/search', {
      params: { name, departmentId }  // передаем 'name' как часть параметров запроса
    });
  } 

  create(data) {
    return http.post('/meds', data);
  }

  update(id, data) {
    return http.put(`/meds/${id}`, data);
  }

  delete(id) {
    return http.delete(`/meds/${id}`);
  }

  deleteAll() {
    return http.delete(`/meds`);
  }
}

export default new MedDataService();