const API = {
  BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : 'https://bluefage.onrender.com/api',

  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  async request(endpoint, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };

    const token = this.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const res = await fetch(`${this.BASE_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw { status: res.status, ...data };
    }

    return data;
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'POST', body: formData });
  },

  auth: {
    register(userData) {
      return API.post('/auth/register', userData);
    },

    async login(email, password) {
      const data = await API.post('/auth/login', { email, password });
      if (data.data?.accessToken) {
        API.setToken(data.data.accessToken);
      }
      return data;
    },

    async logout() {
      try {
        await API.post('/auth/logout');
      } finally {
        API.clearToken();
      }
    },

    me() {
      return API.get('/auth/me');
    },
  },

  bookings: {
    create(bookingData) { return API.post('/bookings', bookingData); },
    list(params) { return API.get('/bookings', params); },
    mine() { return API.get('/bookings/mine'); },
    get(id) { return API.get(`/bookings/${id}`); },
    updateStatus(id, status) { return API.put(`/bookings/${id}/status`, { status }); },
    update(id, data) { return API.put(`/bookings/${id}`, data); },
    delete(id) { return API.delete(`/bookings/${id}`); },
  },

  quotes: {
    create(quoteData) { return API.post('/quotes', quoteData); },
    list() { return API.get('/quotes'); },
    get(id) { return API.get(`/quotes/${id}`); },
    update(id, data) { return API.put(`/quotes/${id}`, data); },
    delete(id) { return API.delete(`/quotes/${id}`); },
  },

  contacts: {
    submit(contactData) { return API.post('/contacts', contactData); },
    list() { return API.get('/contacts'); },
  },

  newsletter: {
    subscribe(email) { return API.post('/newsletter', { email }); },
    unsubscribe(email) { return API.post(`/newsletter/unsubscribe/${email}`); },
  },

  gallery: {
    list(category) {
      const params = category ? { category } : {};
      return API.get('/gallery', params);
    },
  },

  blogs: {
    list(params) { return API.get('/blogs', params); },
    getBySlug(slug) { return API.get(`/blogs/${slug}`); },
  },

  testimonials: {
    list() { return API.get('/testimonials'); },
    submit(data) { return API.post('/testimonials', data); },
  },

  packages: {
    list() { return API.get('/packages'); },
    get(id) { return API.get(`/packages/${id}`); },
  },
};
