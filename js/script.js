document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navUl.classList.remove('active');
        });
    });

    // Lazy Loading Images
    const images = document.querySelectorAll('img[data-src]');

    const imageOptions = {
        threshold: 0,
        rootMargin: "0px 0px 50px 0px"
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                preloadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, imageOptions);

    images.forEach(image => {
        imageObserver.observe(image);
    });

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) {
            return;
        }
        img.src = src;
    }

    // Scroll Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    // Lightbox Functionality
    const p1Images = [
        'images/project_01/01.jpg',
        'images/project_01/02.jpg',
        'images/project_01/03.jpg',
        'images/project_01/04.jpg',
        'images/project_01/05.jpg'
    ];

    const p2Images = [
        'images/project_02/01.jpg',
        'images/project_02/02.jpg',
        'images/project_02/03.jpg'
    ];

    const p3Images = [
        'images/project_03/01.jpg',
        'images/project_03/02.jpg',
        'images/project_03/03.jpg',
        'images/project_03/04.jpg',
        'images/project_03/05.jpg'
    ];

    const p4Images = [
        'images/project_04/01.jpg',
        'images/project_04/02.jpg'
    ];

    const p5Images = [
        'images/project_05/01.jpg',
        'images/project_05/02.jpg',
        'images/project_05/03.jpg'
    ];

    const p6Images = [
        'images/project_06/01.jpg',
        'images/project_06/02.png',
        'images/project_06/03.png',
        'images/project_06/04.jpg',
        'images/project_06/05.png'
    ];

    const projects = {
        'p1': p1Images,
        'p2': p2Images,
        'p3': p3Images,
        'p4': p4Images,
        'p5': p5Images,
        'p6': p6Images
    };

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';

    // Create container for carousel
    const lbContent = document.createElement('div');
    lbContent.className = 'lightbox-content';
    lightbox.appendChild(lbContent);

    // Create 3 images: Prev, Main, Next
    const prevImg = document.createElement('img');
    prevImg.className = 'lb-img lb-side lb-prev';
    lbContent.appendChild(prevImg);

    const mainImg = document.createElement('img');
    mainImg.className = 'lb-img lb-main';
    lbContent.appendChild(mainImg);

    const nextImg = document.createElement('img');
    nextImg.className = 'lb-img lb-side lb-next';
    lbContent.appendChild(nextImg);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    lightbox.appendChild(closeBtn);

    document.body.appendChild(lightbox);

    let currentGallery = [];
    let currentImageIndex = 0;

    // Project Gallery Logic
    const projectTiles = document.querySelectorAll('.project-tile');

    projectTiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = tile.getAttribute('data-project');
            if (projects[projectId]) {
                currentGallery = projects[projectId];
                currentImageIndex = 0;
                openLightbox();
            }
        });
    });

    function updateImages() {
        if (currentGallery.length === 0) return;

        // Calculate indices
        const prevIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        const nextIndex = (currentImageIndex + 1) % currentGallery.length;

        mainImg.src = currentGallery[currentImageIndex];

        if (currentGallery.length > 1) {
            prevImg.style.display = 'block';
            nextImg.style.display = 'block';
            prevImg.src = currentGallery[prevIndex];
            nextImg.src = currentGallery[nextIndex];
        } else {
            prevImg.style.display = 'none';
            nextImg.style.display = 'none';
        }
    }

    function openLightbox() {
        lightbox.classList.add('active');
        updateImages();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        updateImages();
    }

    function showPrev() {
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        updateImages();
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lbContent) closeLightbox();
    });

    // Navigation clicks
    prevImg.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    nextImg.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Hero Slideshow Logic
    function initHeroSlideshow() {
        const slideshowContainer = document.querySelector('.hero-slideshow');
        if (!slideshowContainer) return;

        const heroImages = [
            'images/hero_slideshow/slide_01.jpg',
            'images/hero_slideshow/slide_02.jpg',
            'images/hero_slideshow/slide_03.jpg',
            'images/hero_slideshow/slide_04.png',
            'images/hero_slideshow/slide_05.jpg'
        ];

        // Create slide elements
        heroImages.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.classList.add('hero-slide');
            if (index === 0) slide.classList.add('active');
            slide.style.backgroundImage = `url('${imgSrc}')`;
            slideshowContainer.appendChild(slide);
        });

        const slides = document.querySelectorAll('.hero-slide');
        let currentSlide = 0;

        if (slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 3000); // Change every 3 seconds
        }
    }

    initHeroSlideshow();
});
