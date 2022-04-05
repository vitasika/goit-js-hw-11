import GalleryApiService from './galleryIP';

import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import galleryTpl from '../templates/gallery.hbs';

const refs = {
    formEl: document.querySelector('.search-form'),
    btnSubmit: document.querySelector('.btn-submit'),
    divGallery: document.querySelector('.gallery'),
    loadMoreEl: document.querySelector('.loadmore'),
};

refs.formEl.addEventListener('submit', onClickSubmit);
refs.loadMoreEl.addEventListener('click', onLoadMore);

const galleryApiService = new GalleryApiService();

refs.loadMoreEl.classList.add('is-hidden');

async function onClickSubmit(e) {
    e.preventDefault();
    clearHitsContainer();
    
  galleryApiService.query = e.currentTarget.elements.searchQuery.value;
  if (galleryApiService.query === '') {
      Notiflix.Notify.info('Please enter something');
      
    
    
      return;
    }
    
    galleryApiService.resetPage();
    
  try {
      const urlObj = await galleryApiService.fetchGallery();

      refs.loadMoreEl.classList.remove('is-hidden'); // скрыть кнопку при пустом поиске
    
      const { data } = urlObj;
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
      
      appendHitsMarkup(data.hits);
      
      lightbox.refresh(); //вызов лайтбокса
      
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

async function onLoadMore() {
    try {
        const urlObj = await galleryApiService.fetchGallery();

    const {
      data: { hits },
      } = urlObj;
      
    appendHitsMarkup(hits);
    lightbox.refresh();
    const { height: cardHeight } = refs.divGallery.firstElementChild.getBoundingClientRect();
    
      window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (galleryApiService.page > urlObj.data.totalHits / galleryApiService.per_page) {
      refs.brtMore.classList.add('is-hidden');
      return Notiflix.Notify.success('Your search has come to an end');
    }
    } catch (error) {

        refs.loadMoreEl.classList.add('is-hidden'); // скрыть кнопку при пустом поиске

    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function appendHitsMarkup(hits) {
  refs.divGallery.insertAdjacentHTML('beforeend', galleryTpl(hits));
}

function clearHitsContainer() {
  refs.divGallery.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
