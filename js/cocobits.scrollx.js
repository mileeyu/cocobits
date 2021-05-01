/*! SCROLLX */

function scrollX() {
  if (document.querySelector('.scrollX')) {
    const containers = document.querySelectorAll('.scrollX')

    let scrollXActive = false,
      startX,
      scrollLeft,
      distanceX,
      moveX,
      velX,
      momentumID

    containers.forEach(container => {
      container.addEventListener('mousedown', () => { start(container, event) })
      container.addEventListener('mousemove', () => { move(container, event) })

      container.addEventListener('mouseup', () => {
        scrollXActive = false
        container.classList.remove('scrollX--active')
        momentumStart(container)
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
    })

    // Start 
    function start(container, event) {
      event.preventDefault()

      let containerLeft = container.offsetLeft
      // Allow mouse click and drag
      scrollXActive = true
      container.classList.add('scrollX--active')

      // Get mousedown position
      startX = event.clientX - containerLeft
      scrollLeft = container.scrollLeft
      momentumEnd()
    }

    // Move
    function move(container, event) {
      let containerLeft = container.offsetLeft

      if (!scrollXActive) return
      event.preventDefault()

      distanceX = event.clientX - containerLeft
      moveX = (distanceX - startX)

      let prevScrollLeft = scrollLeft

      container.scrollLeft = scrollLeft - moveX
      velX = container.scrollLeft - prevScrollLeft
    }

    // Momentum
    function momentumStart(container) {
      momentumEnd()
      momentumID = requestAnimationFrame(function () {
        momentumLoop(container)
      })
    }

    function momentumEnd() {
      cancelAnimationFrame(momentumID)
    }

    function momentumLoop(container) {
      container.scrollLeft += velX
      velX *= 0.95

      if (Math.abs(velX) > 0.75) {
        momentumID = requestAnimationFrame(function () {
          momentumLoop(container)
        })
      }
    }
  } else { return }
}

module.exports = { scrollX }