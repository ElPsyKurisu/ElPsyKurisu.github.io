//this first part is just for the gallery-view aka class=research-project
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
    // Do not return here if other scripts on the page need to run
    // This part of the script is for .research-project slideshow,
    // the timeline script below should still initialize.
  } else {
    // Only run slideshow logic if projects exist
    function showProject(index) {
      projects.forEach((project, idx) => {
        project.style.display = (idx === index) ? 'block' : 'none';
      });
    }

    showProject(currentProjectIndex); // Initial display

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentProjectIndex++;
        if (currentProjectIndex >= projects.length) {
          currentProjectIndex = 0;
        }
        showProject(currentProjectIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentProjectIndex--;
        if (currentProjectIndex < 0) {
          currentProjectIndex = projects.length - 1;
        }
        showProject(currentProjectIndex);
      });
    }
  }
});

// New Animated Timeline Script
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll("#animated-timeline-container li");

  if (items.length === 0) {
    return; // No timeline items found, so no need to set up listeners or run functions
  }

  function isItemInView(item) {
    const rect = item.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }

  function callbackFunc() {
    for (let i = 0; i < items.length; i++) {
      if (isItemInView(items[i])) {
        items[i].classList.add("show");
      }
    }
  }

  // Initial check once DOM is loaded and items are potentially in view
  callbackFunc();

  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);
});
