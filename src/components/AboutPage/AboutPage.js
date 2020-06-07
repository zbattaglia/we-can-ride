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
      <br />
      It’s not about what disabilities or challenges our riders face, but rather what their abilities are and how they can be discovered through therapeutic horseback riding and other equine assisted activities. 
      <br />
      Join us in helping make a difference!
      </p>
    </div>
  </div>
);

export default AboutPage;
