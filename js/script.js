document.addEventListener('DOMContentLoaded', () => {
  const projects = document.querySelectorAll('.research-project');
  const prevBtn = document.getElementById('prevProjectBtn');
  const nextBtn = document.getElementById('nextProjectBtn');
  let currentProjectIndex = 0;

  // If no projects, hide buttons and stop
  if (projects.length === 0) {
    if (prevBtn) {
      prevBtn.style.display = 'none';
    }
    if (nextBtn) {
      nextBtn.style.display = 'none';
    }
    return; 
  }

  function showProject(index) {
    projects.forEach((project, idx) => {
      // Assuming 'block' is the desired display style for visible projects.
      // If projects use a different display style (e.g., 'flex'), adjust here.
      project.style.display = (idx === index) ? 'block' : 'none';
    });
  }

  // Initial display of the first project
  showProject(currentProjectIndex);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentProjectIndex++;
      if (currentProjectIndex >= projects.length) {
        currentProjectIndex = 0; // Loop to the first project
      }
      showProject(currentProjectIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentProjectIndex--;
      if (currentProjectIndex < 0) {
        currentProjectIndex = projects.length - 1; // Loop to the last project
      }
      showProject(currentProjectIndex);
    });
  }
});

// New Animated Timeline Script
var items = document.querySelectorAll("#animated-timeline-container li");

function isItemInView(item){
  var rect = item.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function callbackFunc() {
    // Check if items exist to avoid errors if the timeline is not on the current page
    if (items.length > 0) {
        for (var i = 0; i < items.length; i++) {
          if (isItemInView(items[i])) {
            items[i].classList.add("show");
          }
        }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);
