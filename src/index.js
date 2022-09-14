import './css/styles.css';
import { Notify } from 'notiflix';
import { PixabayApi } from './js/pixabayApi';

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

form.addEventListener("submit", onFormSubmit);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onFormSubmit(evt) {
    evt.preventDefault();
    gallery.innerHTML = "";
    loadMoreBtn.setAttribute("hidden", "true");

    const { searchQuery } = evt.currentTarget.elements;
    const searchValue = searchQuery.value.trim();
    if (!searchValue) return;

    PixabayApi.page = 1;

    try {
        const data = await PixabayApi.searchImages(searchValue);
        renderGallery(data);

        if (!isMaxPage()) {
            loadMoreBtn.removeAttribute("hidden");  
        }
    } catch (error) {
        Notify.failure(error.message);
    }
    evt.target.reset();
};

async function onLoadMore() {
    PixabayApi.page += 1;

    const data = await PixabayApi.searchImages();
    renderGallery(data);

    if (isMaxPage()) {
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
};

function isMaxPage() {
    if (PixabayApi.page === PixabayApi.maxPage) {
        loadMoreBtn.setAttribute("hidden", "true");
        return true;
    }
    return false;
}

function renderGallery(images) {
    const list = images.reduce((acc, {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads }) => 
        acc + `<div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes ${likes}</b>
                        </p>
                        <p class="info-item">
                            <b>Views ${views}</b>
                        </p>
                        <p class="info-item">
                            <b>Comments  ${comments}</b>
                        </p>
                        <p class="info-item">
                            <b>Downloads ${downloads}</b>
                        </p>
                    </div>
                </div>`
        , "");
    gallery.insertAdjacentHTML("beforeend", list);
};