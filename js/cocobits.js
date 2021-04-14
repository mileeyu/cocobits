/*!
  * COCOBITS JS | (https://cocobits.github.io)
  * Copyright 2021 Milee Yu
  * Licensed under MIT
  */

/* TAB */
function tab() {
  // Initialize variables
  const tabLinks = document.querySelector('.tab-menu').children,
    tabContents = document.querySelector('.tab-contents').children

  // Select first tab link by default
  tabLinks[0].classList.add('content--visible')
  // Show first tab content by default
  tabContents[0].classList.add('d-block')
  // Hide rest of content by default
  Array.from(tabContents).forEach(child => {
    if (child.classList.contains('d-block')) {
      return
    } else {
      child.classList.add('d-none')
    }
  })

  Array.from(tabLinks).forEach(link => {
    
    link.addEventListener('click', (e) => {
      Array.from(tabLinks).forEach(link => {
        link.classList.remove('content--visible')
      })
      // Change color of selected link
      if (e.target === link) {
        link.classList.add('content--visible')
      }
      // Show content of selected link
      Array.from(tabContents).forEach(content => {
        if (link.dataset.tab === content.dataset.tab) {
          content.classList.replace('d-none', 'd-block')
        } else {
          content.classList.replace('d-block', 'd-none')
        }
      })
    })
  })
}

/* Accordion */
function accordion() {
  const accButtons = document.querySelectorAll('.accordion'),
        py = 48
  
  // Listen for click
  accButtons.forEach(button => {
    button.addEventListener('click', function () {
      button.classList.toggle('accordion-active')

      if (button.classList.contains('accordion-active')) {
        button.querySelector('.plus').style.setProperty('--plus-after', '90deg')
      } else {
        button.querySelector('.plus').style.setProperty('--plus-after', '0deg')
      }
      let content = button.nextElementSibling

      if (content.style.maxHeight) {
        content.style.maxHeight = null
        content.style.padding = '0px 16px'
      } else {
        content.style.maxHeight = `${content.scrollHeight + py}px`
        content.style.padding = '24px 16px'
      }
    })
  })
}

/* Carousel */
function carousel() {
  // Initialize variables
  let slideContainer = document.querySelector('.slide-container'),
      slides = document.querySelectorAll('.slide'),
      navs = document.querySelectorAll('.slide-nav'),
      slidesCount = slides.length,
      slideWidth = slides[0].offsetWidth,
      slideHeight = slides[0].scrollHeight,
      lastSlidePos = slideContainer - slideWidth,
      lastIndex = slidesCount - 1,
      startX = undefined,
      moveX = undefined,
      distanceX = undefined,
      index = 0,
      longTouch = false,
      mouseMoving = false,
      prev = document.querySelector('.slide-prev'),
      next = document.querySelector('.slide-next')

  // Reset carousel on page load or window resize
  slideContainer.classList.remove('animate-transition')
  slideContainer.style.transform = 'translate3d(0px, 0px, 0px)'
  slideContainer.style.height = `${slideHeight}px`
  if (navs[0]) { navs[0].classList.add('slide-nav--active') }

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
  slideContainer.addEventListener('touchstart', (event) => { start(event) }, false)
  slideContainer.addEventListener('touchmove', (event) => { move(event) }, false)
  slideContainer.addEventListener('touchend', (event) => { end(event) }, false)
  slideContainer.addEventListener('transitionend', (event) => { transition(event)}, false)
  if (prev && next) {
    prev.addEventListener('click', (event) => { shiftSlide(event, 'prev') }, false)
    next.addEventListener('click', (event) => { shiftSlide(event, 'next') }, false)
  }
  if (navs) {
    navs.forEach((nav, i) => {
      let clickIndex = i
      nav.addEventListener('click', (event) => {
        navigateToSlide(clickIndex, null)
        transition(event)
      }, false)
    })
  }

  // Start function
  function start(event) {
    event.preventDefault()

    if (event.type == 'touchstart') {
      // Test for flick
      longTouch = false 
      setTimeout(function () {
        slideContainer.longTouch = true
      }, 250)

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
      if (moveX < lastSlidePos) {
        slideContainer.style.transform = `translate3d(-${moveX}px, 0, 0)`
      }
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
      if (absMove > 100 || longTouch == false) {
        if (distanceX > (index * slideWidth) && index < lastIndex) {
          index++
        } else if (distanceX < (index * slideWidth) && index > 0) {
          index--
        }
      }
    }
    mouseMoving = false
    // Move and animate container
    slideContainer.classList.add('animate-transition')
    slideContainer.style.transform = `translate3d(-${index * slideWidth}px, 0, 0)`

    // Move to new nav position
    if (navs[0]) {
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
    slideContainer.style.transform = `translate3d(-${index * slideWidth}px, 0, 0)`

    // Move to new nav position
    if (navs[0]) {
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
      slideContainer.style.transform = `translate3d(-${index * slideWidth}px, 0, 0)`
      // Move to new nav position
      navs.forEach(nav => {
        nav.classList.remove('slide-nav--active')
      })
      navs[clickIndex].classList.add('slide-nav--active')
    }

    // Move to new nav position
    if (slideIndex != null) {
      navs.forEach(nav => {
        nav.classList.remove('slide-nav--active')
      })
      navs[slideIndex].classList.add('slide-nav--active')
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

module.exports = { tab }
module.exports = { accordion }
module.exports = { carousel }