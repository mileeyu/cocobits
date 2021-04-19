/*! SCROLLX */

function scrollX() {
  if (document.querySelector('.scrollX')) {
    const container = document.querySelector('.scrollX'),
        containerLeft = container.offsetLeft
    
    let scrollXActive = false,
        startX,
        scrollLeft,
        distanceX,
        moveX,
        velX,
        momentumID

    container.addEventListener('mousedown', start) 
    container.addEventListener('mousemove', move)

    container.addEventListener('mouseup', () => {
      scrollXActive = false
      container.classList.remove('scrollX--active')
      momentumStart()
    })
    container.addEventListener('mouseleave', () => {
      scrollXActive = false
      container.classList.remove('scrollX--active')
      // Disable anchors
      if (container.querySelectorAll('a')) {
        container.querySelectorAll('a').forEach(link => {
          link.classList.remove('disable-pointer')
        })
      }
    })
    container.addEventListener('wheel', (event) => {
      momentumEnd()
    })

    // Start 
    function start(event) {
      event.preventDefault()
      // Allow mouse click and drag
      scrollXActive = true
      container.classList.add('scrollX--active')

      // Get mousedown position
      startX = event.clientX - containerLeft
      scrollLeft = container.scrollLeft
      momentumEnd()
    }
    
    // Move
    function move(event) {
      if (!scrollXActive) return 
      event.preventDefault()

      distanceX = event.clientX - containerLeft
      moveX = (distanceX - startX)

      let prevScrollLeft = scrollLeft

      container.scrollLeft = scrollLeft - moveX
      velX = container.scrollLeft - prevScrollLeft
    }

    // Momentum
    function momentumStart() {
      momentumEnd()
      momentumID = requestAnimationFrame(momentumLoop)
    }

    function momentumEnd() {
      cancelAnimationFrame(momentumID)
    }

    function momentumLoop() {
      container.scrollLeft += velX 
      velX *= 0.95

      if (Math.abs(velX) > 0.75) {
        momentumID = requestAnimationFrame(momentumLoop)
      }
    }
  } else { return }
}

module.exports = { scrollX }