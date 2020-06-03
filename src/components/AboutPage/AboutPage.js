import React from 'react';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

const AboutPage = () => (
  <div>
    <div>
      <p className="about">
      It is the mission of We Can Ride, Inc. to improve the lives of individuals with disabilities or special needs through equine assisted activities and therapy.
      </p>
    </div>
  </div>
);

export default AboutPage;
