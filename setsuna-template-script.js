]<script>
  document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll('.cmd, .prv, .sty');
    attachToggleBehavior(elements);
    applyStyles();

    const observer = new MutationObserver(() => {
      var updatedElements = document.querySelectorAll('.cmd, .prv, .sty');
      attachToggleBehavior(updatedElements);
      applyStyles();
    });

    const config = { childList: true, subtree: true };

    // Observe changes in the body (or a more specific container)
    observer.observe(document.body, config);
  });

  function attachToggleBehavior(elements) {
    elements.forEach(function(element) {
      element.setAttribute('tabindex', '0');
      element.addEventListener('click', function() {
        togglePopout(element);
      });
    });
  }

  function togglePopout(element) {
    // Close all other popouts and remove the clicked class from cmd and prv
    var allElements = document.querySelectorAll('.cmd, .prv, .sty');
    allElements.forEach(function(el) {
      if (el !== element) {
        el.classList.remove('show');
        if (el.classList.contains('cmd') || el.classList.contains('prv')) {
          el.classList.remove('clicked');
        }
      }
    });

    // Toggle the show class on the clicked element
    element.classList.toggle('show');
    // Toggle the clicked class only for cmd and prv
    if (element.classList.contains('cmd') || element.classList.contains('prv')) {
      element.classList.toggle('clicked');
    }
  }

  function applyStyles() {
    const elements = document.querySelectorAll('.cmd');
    
    elements.forEach(element => {
      const classList = element.className.split(' ');
      const mainClass = classList.find(cls => cls !== 'cmd' && cls !== 'mastered' && cls !== 'commanding');
      const shorthandVariable = '--' + mainClass;
      
      const shorthandValue = getComputedStyle(element).getPropertyValue(shorthandVariable).trim();
      const [activeValue, displayValue] = shorthandValue.split(',').map(val => val.trim());
      
      // Calculate the opacity based on the active value
      const opacity = parseFloat(activeValue) + 0.5;
      
      // Apply background color based on class
      if (classList.includes('mastered')) {
        element.style.background = `rgba(var(--mastered-color), ${opacity})`;
      } else {
        element.style.background = `rgba(var(--cmd-color), ${opacity})`;
      }

      // Apply border color for commanding class
      if (classList.includes('commanding')) {
        element.style.borderColor = `rgba(var(--mastered-color), ${opacity})`;
      }

      // Convert "hide" to "none" for display property
      const display = displayValue === 'hide' ? 'none' : 'block';

      // Handle display property based on custom variables
      element.style.display = display;
      const popout = element.querySelector('.popout');
      if (popout) {
        popout.style.display = display;
      }
    });
  }
</script>
