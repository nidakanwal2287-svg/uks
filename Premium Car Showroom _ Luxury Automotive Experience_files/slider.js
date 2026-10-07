// Swiper Slider initializations
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Main Slider
  if (document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      },
    });
  }

  // 2. Popular Brands Slider
  if (document.querySelector('.brands-swiper')) {
    new Swiper('.brands-swiper', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        480: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 30 },
        1024: { slidesPerView: 6, spaceBetween: 40 },
      },
    });
  }

  // 3. Testimonials/Reviews Slider
  if (document.querySelector('.reviews-swiper')) {
    new Swiper('.reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.reviews-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  // 4. Car Gallery (Main + Thumbnails) on Detail page
  if (document.querySelector('.gallery-thumbs')) {
    const galleryThumbs = new Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
    
    new Swiper('.gallery-main', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.gallery-next',
        prevEl: '.gallery-prev',
      },
      thumbs: {
        swiper: galleryThumbs,
      },
    });
  }

  // 5. Related Cars Slider
  if (document.querySelector('.related-swiper')) {
    new Swiper('.related-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.related-next',
        prevEl: '.related-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
});
