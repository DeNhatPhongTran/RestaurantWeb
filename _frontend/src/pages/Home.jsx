import React from 'react'

export default function Home() {
  return (
    <div className="site">
      <header className="container header">
        <div className="brand">Poodb</div>
        <nav className="nav">
          <a>Menu</a>
          <a>About</a>
          <a>Blog</a>
          <button className="cta">Order Now</button>
        </nav>
      </header>

      <main className="container">
        <section className="hero flex flex-col md:flex-row gap-8 items-center">
          <div className="hero-left">
            <h2 className="hero-title">The Perfect Space to Enjoy best Food</h2>
            <p className="hero-sub">A beautiful restaurant landing layout — hero text and CTA.</p>
            <div className="search-row mt-4 flex">
              <input className="flex-1 p-3 rounded-md border" placeholder="Search dishes..." />
              <button className="ml-3 bg-primary text-white px-4 rounded-md">Search</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image">[Hero image placeholder]</div>
          </div>
        </section>

        <section className="section">
          <h3>Our Special Dishes</h3>
          <div className="cards-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <article key={i} className="card">
                <div className="image">Image</div>
                <div className="title">Dish {i + 1}</div>
                <div className="desc">Short description</div>
                <div className="row">
                  <div className="price">$50.00</div>
                  <button className="cta">Add</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">© 2025 Poodb</div>
      </footer>
    </div>
  )
}
