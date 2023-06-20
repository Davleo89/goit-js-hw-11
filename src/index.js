import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '37405246-b515ac40ea1ef19187162e1b4';
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

let currentPage = 1;
let currentQuery = '';

function clearGallery() {
  gallery.innerHTML = '';
}

function showNotification(message) {
  Notiflix.Notify.info(message);
}

function showErrorNotification(message) {
  Notiflix.Notify.failure(message);
}

async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get(`${API_URL}&q=${query}&page=${page}`);
    const data = response.data;
    return data.hits;
  } catch (error) {
    showErrorNotification('Failed to fetch images. Please try again.');
    return [];
  }
}

function renderImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const imageElement = document.createElement('img');
  imageElement.src = image.webformatURL;
  imageElement.alt = image.tags;
  imageElement.loading = 'lazy';

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b><i class="fa-solid fa-heart"></i></b> ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b><i class="fa-solid fa-eye"></i></b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b><i class="fa-solid fa-comment-dots"></i></b> ${image.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b><i class="fa-solid fa-download"></i></b> ${image.downloads}`;

  infoContainer.appendChild(likes);
  infoContainer.appendChild(views);
  infoContainer.appendChild(comments);
  infoContainer.appendChild(downloads);

  card.appendChild(imageElement);
  card.appendChild(infoContainer);

  gallery.appendChild(card);
}

// Function to handle form submission
async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const query = formData.get('searchQuery');

  if (!query) {
    showNotification('Please enter a search query');
    return;
  }

  clearGallery();
  currentQuery = query;
  currentPage = 1;

  const images = await fetchImages(query, currentPage);

  if (images.length === 0) {
    showNotification(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    images.forEach(renderImageCard);
    if (images.length === 40) {
      loadMoreBtn.style.display = 'block';
    }
  }
}

// Ffuncion para cargar la pagina al hacer click
async function handleLoadMore() {
  currentPage++;
  const images = await fetchImages(currentQuery, currentPage);

  if (images.length === 0) {
    showNotification(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.style.display = 'none';
  } else {
    images.forEach(renderImageCard);
    if (images.length < 40) {
      loadMoreBtn.style.display = 'none';
    }
  }
}

//funcion para cargar la pagina al scrollear

/*function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      handleLoadMore();
    }
  }*/

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);
window.addEventListener('scroll', handleScroll)
