  <script>
    document.addEventListener('DOMContentLoaded', function() {
      function loadExternalContent(container) {
        fetch('https://theonethane.github.io/theonethane/setsuna-template-commands.html')
          .then(response => response.text())
          .then(html => {
            container.innerHTML = html;
            var newElements = container.querySelectorAll('.cmd, .prv, .sty');
            attachToggleBehavior(newElements);
            applyStyles(container);
          })
          .catch(err => console.warn('Failed to load setsuna-template-commands.html', err));
      }

      function attachToggleBehavior(elements) {
        elements.forEach(function(element) {
          element.setAttribute('tabindex', '0');
          element.addEventListener('click', function() {
            togglePopout(element);
          });
        });
      }

      function togglePopout(element) {
        var allElements = element.closest('.side-by-side').querySelectorAll('.cmd, .prv, .sty');
        allElements.forEach(function(el) {
          if (el !== element) {
            el.classList.remove('show');
            if (el.classList.contains('cmd') || el.classList.contains('prv')) {
              el.classList.remove('clicked');
            }
          }
        });

        element.classList.toggle('show');
        if (element.classList.contains('cmd') || element.classList.contains('prv')) {
          element.classList.toggle('clicked');
        }
      }

      function applyStyles(container) {
        const elements = container.querySelectorAll('.cmd');
        
        elements.forEach(element => {
          const classList = element.className.split(' ');
          const mainClass = classList.find(cls => cls !== 'cmd' && cls !== 'mastered' && cls !== 'commanding');
          const shorthandVariable = '--' + mainClass;
          
          const shorthandValue = getComputedStyle(element).getPropertyValue(shorthandVariable).trim();
          const [activeValue, displayValue] = shorthandValue.split(',').map(val => val.trim());
          
          const opacity = parseFloat(activeValue) + 0.5;
          
          if (classList.includes('mastered')) {
            element.style.background = `rgba(var(--mastered-color), ${opacity})`;
          } else {
            element.style.background = `rgba(var(--cmd-color), ${opacity})`;
          }

          if (classList.includes('commanding')) {
            element.style.borderColor = `rgba(var(--mastered-color), ${opacity})`;
          }

          const display = displayValue === 'hide' ? 'none' : 'block';

          element.style.display = display;
          const popout = element.querySelector('.popout');
          if (popout) {
            popout.style.display = display;
          }
        });
      }

      function initialize() {
        document.querySelectorAll('.side-by-side').forEach((container) => {
          loadExternalContent(container);
        });
      }

      initialize();

      // Setup observer to reload external content when necessary
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('side-by-side')) {
              loadExternalContent(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              node.querySelectorAll('.side-by-side').forEach(container => loadExternalContent(container));
            }
          });

          if (mutation.type === 'attributes' && mutation.target.classList.contains('side-by-side')) {
            loadExternalContent(mutation.target);
          }
        });
      });

      const config = { childList: true, subtree: true, attributes: true };

      // Observe changes in the body (or a more specific container)
      observer.observe(document.body, config);
    });
  </script>
