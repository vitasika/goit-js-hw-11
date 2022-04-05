const axios = require('axios');
const BAZE_URL = 'https://pixabay.com/api/';
const API_KEY = '26539400-9e79bbb73797859cc5712c53e';
//console.log(API_KEY);

export default class GalleryApiService {
    constructor() {
    this.searchQuery = '';
    this.page = 1;
        this.per_page = 40;
    }
    async fetchGallery() {
        const searchParams = new URLSearchParams({
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: this.per_page,
            page: this.page,
        });

        const url = await axios.get(`${BAZE_URL}?key=${API_KEY}&${searchParams}`);
        const data = await url;

        if (!data.data.hits.length) {
            throw new Error(data.data.hits.status);
        }
        this.incrementPage();
            console.log(data);
        return data;
        
    }
    
    get query() {
        return this.searchQuery;
    }
    
    set query(newQueery) {
        this.searchQuery = newQueery;
    }
    incrementPage() {
        this.page += 1;
    }
    
    resetPage() {
        this.page = 1;
    }
}