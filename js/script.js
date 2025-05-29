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
