/*! CAROUSEL */

function carousel() {
  // Initialize variables
  let slideContainer = document.querySelector('.slide-container'),
      slides = document.querySelectorAll('.slide'),
      slidesCount = slides.length,
      slideHeight = slides[0].offsetHeight,
      slideWidth = slides[0].offsetWidth,
      lastIndex = slidesCount - 1,
      [startX, moveX] = [0, 0],
      distanceX = 0,
      index = 0,
      mouseMoving = false,
      navButtons = document.querySelectorAll('.slide-nav'),
      prev = document.querySelector('.slide-prev'),
      next = document.querySelector('.slide-next')

  // Wait till first image is fully loaded
  if (slides[0] && slideHeight === 0) {
    requestAnimationFrame(carousel)
  }
  // Set width and height of each slide
  slides.forEach(slide => {
    slide.style.width = `${slideWidth}px`
  })
  // Set the container height and width
  slideContainer.style.height = `${slideHeight}px`
  slideContainer.style.width = `${slidesCount * slideWidth}px`
  
  // Reset carousel on page load or window resize
  slideContainer.classList.remove('animate-transition')
  slideContainer.style.transform = 'translateX(0px)'

  // Style navigation items if available
  if (navButtons[0]) { navButtons[0].classList.add('slide-nav--active') }
  if (prev && next) {
    prev.style.setProperty('--slide-controller-center', `${slideHeight / 2}px`)
    next.style.setProperty('--slide-controller-center', `${slideHeight / 2}px`)
    if (slidesCount == 1) {
      prev.style.display = 'none'
      next.style.display = 'none'
    } else {
      prev.style.display = 'none'
      next.style.display = 'block'
    }
  }

  // EventListeners
  slideContainer.onmousedown = start
  slideContainer.addEventListener('touchstart', start, false)
  slideContainer.addEventListener('touchmove', move, false)
  slideContainer.addEventListener('touchend', end, false)
  slideContainer.addEventListener('transitionend', transition, false)

  if (prev && next || navButtons[0] && (prev && next)) {
    prev.addEventListener('click', (event) => { shiftSlide(event, 'prev') }, false)
    next.addEventListener('click', (event) => { shiftSlide(event, 'next') }, false)
  }
  if (navButtons[0]) {
    navButtons.forEach((nav, i) => {
      let clickIndex = i
      nav.addEventListener('click', (event) => {
        navigateToSlide(clickIndex, null)
        if (prev && next) { transition(event) }
      }, false)
    })
  }

  // Start function
  function start(event) {
    event.preventDefault()

    if (event.type == 'touchstart') {
      // Get initial touch position
      startX = event.touches[0].clientX
    } else if (event.type == 'mousedown') {
      mouseMoving = true
      startX = event.clientX 
      slideContainer.onmousemove = move
      slideContainer.onmouseup = end 
    }
  }

  // Move function
  function move(event) {
    event.preventDefault()

    if (event.type == 'touchmove') {
      // Get moving touch position
      moveX = event.touches[0].clientX
      // Calc container touch movement
      distanceX = (index * slideWidth) + (startX - moveX)
      // Limit container from moving beyond last slide
      slideContainer.style.transform = `translateX(-${distanceX}px)`
    } else if (mouseMoving) {
      moveX = event.clientX
      // Calc container mouse movement
      distanceX = (index * slideWidth) + (startX - moveX)
    }
  }

  // End function
  function end(event) {
    event.preventDefault()

    // Calc distance swiped 
    let absMove = Math.abs(index * slideWidth - distanceX)
    
    if (event.type == 'mouseup' || event.type == 'touchend') {
      if (absMove > 100) {
        if (startX > moveX && index < lastIndex) {
          index++
        } else if (startX < moveX && index > 0) {
          index--
        }
      }
    }
    mouseMoving = false
    // Move and animate container
    slideContainer.classList.add('animate-transition')
    slideContainer.style.transform = `translateX(-${index * slideWidth}px)`

    // Move to new nav position
    if (navButtons[0]) {
      let slideIndex = index
      navigateToSlide(null, slideIndex)
    }
  }

  // Shiftslide function
  function shiftSlide(event, clickEvent) {
    event.preventDefault()

    if (event.type == 'click') {
      if (clickEvent == 'next' && index < lastIndex) {
        index++
      } else if (clickEvent == 'prev' && index > 0) {
        index--
      }
    }
    // Move and animate container
    slideContainer.classList.add('animate-transition')
    slideContainer.style.transform = `translateX(-${index * slideWidth}px)`

    // Move to new nav position
    if (navButtons[0]) {
      let slideIndex = index
      navigateToSlide(null, slideIndex)
    }
  }

  // Navigate to slide function
  function navigateToSlide(clickIndex, slideIndex) {
    if (clickIndex != null) {
      index = clickIndex
      // Move and animate container
      slideContainer.classList.add('animate-transition')
      slideContainer.style.transform = `translateX(-${index * slideWidth}px)`
      // Move to new nav position
      navButtons.forEach(nav => {
        nav.classList.remove('slide-nav--active')
      })
      navButtons[clickIndex].classList.add('slide-nav--active')
    }

    // Move to new nav position
    if (slideIndex != null) {
      navButtons.forEach(nav => {
        nav.classList.remove('slide-nav--active')
      })
      navButtons[slideIndex].classList.add('slide-nav--active')
    }
  }

  // Transition function
  function transition(event) {
    event.preventDefault()

    // Show and hide arrow controller based on slide index position
    if (index == 0) {
      prev.style.display = 'none'
      next.style.display = 'block'
    } else if (index == lastIndex) {
      prev.style.display = 'block'
      next.style.display = 'none'
    } else {
      prev.style.display = 'block'
      next.style.display = 'block'
    }
  }
}

// Load carousel on window resize
window.addEventListener('resize', () => { carousel() }, false)

module.exports = { carousel }