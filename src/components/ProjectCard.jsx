import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
        View Profile
      </a>
    </div>
  );
};

export default ProjectCard;
