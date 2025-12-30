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

    // --- LIGHTBOX SETUP ---
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';

    const lbContent = document.createElement('div');
    lbContent.className = 'lightbox-content';
    lightbox.appendChild(lbContent);

    // We reuse 3 image elements for the infinite effect:
    // [Prev] [-100%]
    // [Curr] [0%]
    // [Next] [100%]
    const imgPrev = document.createElement('img');
    imgPrev.className = 'lb-img lb-prev';
    imgPrev.draggable = false;
    lbContent.appendChild(imgPrev);

    const imgCurr = document.createElement('img');
    imgCurr.className = 'lb-img lb-curr';
    imgCurr.draggable = false;
    lbContent.appendChild(imgCurr);

    const imgNext = document.createElement('img');
    imgNext.className = 'lb-img lb-next';
    imgNext.draggable = false;
    lbContent.appendChild(imgNext);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    lightbox.appendChild(closeBtn);

    // Metadata Elements
    const lbTitle = document.createElement('h3');
    lbTitle.className = 'lightbox-title';
    lightbox.appendChild(lbTitle);

    const lbDesc = document.createElement('p');
    lbDesc.className = 'lightbox-desc';
    lightbox.appendChild(lbDesc);

    document.body.appendChild(lightbox);

    // State Variables
    let currentGallery = [];
    let currentIndex = 0;

    // Drag Variables
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let isTransitioning = false;

    // --- EVENT LISTENERS (TILES) ---
    const projectTiles = document.querySelectorAll('.project-tile');
    projectTiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = tile.getAttribute('data-project');
            const title = tile.querySelector('h3').innerText;
            const desc = tile.querySelector('p').innerText;

            if (projects[projectId]) {
                currentGallery = projects[projectId];
                currentIndex = 0;

                // Update Metadata
                lbTitle.innerText = title;
                lbDesc.innerText = desc;

                openLightbox();
            }
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        setPositionByIndex();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        isDragging = false; // reset
    }

    // --- MAIN LOGIC ---

    function getIndex(i) {
        // Handle negative modulo correctly
        return (i % currentGallery.length + currentGallery.length) % currentGallery.length;
    }

    function setPositionByIndex() {
        // 1. Temporarily disable transitions to prevent jumping during reset
        imgPrev.style.transition = 'none';
        imgCurr.style.transition = 'none';
        imgNext.style.transition = 'none';

        // 2. Update Sources
        const idxPrev = getIndex(currentIndex - 1);
        const idxCurr = getIndex(currentIndex);
        const idxNext = getIndex(currentIndex + 1);

        imgPrev.src = currentGallery[idxPrev];
        imgCurr.src = currentGallery[idxCurr];
        imgNext.src = currentGallery[idxNext];

        // 3. Classes for fading (visual state)
        imgPrev.classList.remove('current');
        imgCurr.classList.add('current');
        imgNext.classList.remove('current');

        // 4. Reset Positions to Base State
        // Important: We must maintain the vertical center of -50%
        // And horizontal center of -50%

        const spacing = window.innerWidth * 0.75;

        // Prev: Center - Spacing
        imgPrev.style.transform = `translate(calc(-50% - ${spacing}px), -50%) scale(0.9)`;
        // Curr: Center
        imgCurr.style.transform = `translate(-50%, -50%) scale(1)`;
        // Next: Center + Spacing
        imgNext.style.transform = `translate(calc(-50% + ${spacing}px), -50%) scale(0.9)`;

        imgPrev.style.display = 'block';
        imgCurr.style.display = 'block';
        imgNext.style.display = 'block';

        if (currentGallery.length === 1) {
            imgPrev.style.display = 'none';
            imgNext.style.display = 'none';
        }

        // 5. Force Reflow (optional but good for safety) to ensure 'none' applied
        void imgCurr.offsetWidth;
    }

    // --- DRAG / SWIPE HANDLERS ---

    // Touch Events
    lbContent.addEventListener('touchstart', touchStart, { passive: false });
    lbContent.addEventListener('touchmove', touchMove, { passive: false });
    lbContent.addEventListener('touchend', touchEnd);

    // Mouse Events
    lbContent.addEventListener('mousedown', touchStart);
    lbContent.addEventListener('mousemove', touchMove);
    lbContent.addEventListener('mouseup', touchEnd);
    lbContent.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
    });

    function touchStart(event) {
        if (currentGallery.length <= 1) return;
        isDragging = true;
        isTransitioning = false;

        startPos = getPositionX(event);
        lbContent.style.cursor = 'grabbing';

        // Disable transitions for direct 1:1 movement
        imgPrev.style.transition = 'none';
        imgCurr.style.transition = 'none';
        imgNext.style.transition = 'none';

        animationID = requestAnimationFrame(animation);
    }

    function touchMove(event) {
        if (isDragging) {
            if (event.type === 'touchmove') event.preventDefault();
            const currentPosition = getPositionX(event);
            currentTranslate = currentPosition - startPos;
        }
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        // Re-enable transitions for the snap animation
        const transitionCSS = 'transform 0.3s ease-out, opacity 0.3s ease, scale 0.3s ease';
        imgPrev.style.transition = transitionCSS;
        imgCurr.style.transition = transitionCSS;
        imgNext.style.transition = transitionCSS;

        const movedBy = currentTranslate;
        const threshold = window.innerWidth * 0.25; // 25% threshold is usually smoother

        if (movedBy < -threshold) {
            currentIndex += 1;
            updateSliderPosition(true);
        } else if (movedBy > threshold) {
            currentIndex -= 1;
            updateSliderPosition(true);
        } else {
            // Snap back
            updateSliderPosition(false);
        }

        currentTranslate = 0;
        lbContent.style.cursor = 'grab';
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        if (isDragging) {
            setSliderPosition();
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        const spacing = window.innerWidth * 0.75;
        // Maintain vertical translation (-50%) and horizontal (-50%) base!
        imgPrev.style.transform = `translate(calc(-50% - ${spacing}px + ${currentTranslate}px), -50%) scale(0.9)`;
        imgCurr.style.transform = `translate(calc(-50% + ${currentTranslate}px), -50%) scale(1)`;
        imgNext.style.transform = `translate(calc(-50% + ${spacing}px + ${currentTranslate}px), -50%) scale(0.9)`;
    }

    function updateSliderPosition(didChange) {
        const spacing = window.innerWidth * 0.75;
        let dest = 0;
        let scaleCurr = 1;
        let scaleSide = 0.9;

        if (didChange) {
            if (currentTranslate < 0) {
                // Going Next
                dest = -spacing;
                // Visual trick: The 'Next' image is becoming 'Current', so it should scale UP
                // The 'Current' image is becoming 'Prev', so it should scale DOWN
                // But CSS transition handles the property change on the DOM element 
                // We just move them.
            }
            else dest = spacing; // Going Prev
        }

        // Apply final destination of the animation
        imgPrev.style.transform = `translate(calc(-50% - ${spacing}px + ${dest}px), -50%) scale(0.9)`;
        imgCurr.style.transform = `translate(calc(-50% + ${dest}px), -50%) scale(1)`;
        imgNext.style.transform = `translate(calc(-50% + ${spacing}px + ${dest}px), -50%) scale(0.9)`;

        // Wait for animation to finish (300ms) then seamless reset
        setTimeout(() => {
            // Because we moved the elements visually to a new "slot",
            // We now reset the DOM elements to their original "slots"
            // But update the CONTENT (src) to match what is visually there.
            currentIndex = getIndex(currentIndex);
            setPositionByIndex();
        }, 300);
    }
    // --- CLOSERS ---
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click (if not dragging)
    lightbox.addEventListener('click', (e) => {
        // slightly complex: differentiating click from drag release.
        // if drag was small enough to be a click?
        if (!isDragging && Math.abs(currentTranslate) < 5) {
            if (e.target === lightbox || e.target === lbContent) closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
            currentIndex += 1;
            // Manual animation trigger or just jump? Let's simply update for keyboard
            setPositionByIndex();
        }
        if (e.key === 'ArrowLeft') {
            currentIndex -= 1;
            setPositionByIndex();
        }
    });

    // Hero Slideshow Logic (Unchanged)
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
