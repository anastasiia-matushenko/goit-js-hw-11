import axios from "axios";

const baseRequest = axios.create({
    baseURL: "https://pixabay.com/api/",
    params: {
        key: "29900073-a785e0856aaf71ac0f5f90a4d",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
    }
});
   
export class PixabayApi {
    static page = 1;
    static perPage = 40;
    static maxPage = null;
    static query = "";

    
    static async searchImages(query = "") {
        if (query) {
             PixabayApi.query = query; 
        }
        
        const config = {
            params: {
                q: PixabayApi.query,
                page: PixabayApi.page,
                per_page: PixabayApi.perPage,
            }
        };
        
        const searchResult = await baseRequest.get("", config);
        const response = await searchResult.data.hits;

        const totalResults = await searchResult.data.total;
        PixabayApi.maxPage = Math.ceil(totalResults / PixabayApi.perPage);
        
        if (!response.length) {
            throw new Error("Sorry, there are no images matching your search query. Please try again.");
        }
        
        return response;
    }
};
