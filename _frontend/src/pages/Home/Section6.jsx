import React from 'react';

export default function Section6() {
  return (
    <section className="section section6">
      <div className="container">
        <h2 className="section__title">Chef's Special Recommendation</h2>
        <div className="chef__content">
          <div className="chef__image">
            <img 
              src="https://cdn.pixabay.com/photo/2015/01/19/13/51/chef-604662_1280.jpg" 
              alt="Chef"
            />
          </div>
          <div className="chef__info">
            <h3>Chef Marco Rossi</h3>
            <p className="chef__title">Head Chef & Co-founder</p>
            <p className="chef__bio">
              With over 20 years of experience in international cuisine, 
              Chef Marco brings passion and expertise to every dish. His signature 
              style blends traditional flavors with modern techniques.
            </p>
            <p className="chef__recommendation">
              "This week, I especially recommend our Truffle Risotto with Pan-seared 
              Scallops. It's a perfect blend of elegance and comfort."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
