import React from 'react';
import '../../styles/UserPage.css';

export default function Blog() {
  return (
    <div className="page page-container">
      <h1>Unser Blog</h1>
      <div className="blog-posts">
        <article className="blog-post">
          <h2>Tipps für effektives Lernen</h2>
          <p className="post-date">15. März 2024</p>
          <p>Entdecken Sie unsere besten Strategien für erfolgreiches Lernen...</p>
        </article>
        <article className="blog-post">
          <h2>Wie man Online-Nachhilfe optimal nutzt</h2>
          <p className="post-date">1. März 2024</p>
          <p>Maximieren Sie Ihre Lernerfolge mit diesen Expertentipps...</p>
        </article>
        <article className="blog-post">
          <h2>Vorbereitung auf das Abitur</h2>
          <p className="post-date">20. Februar 2024</p>
          <p>Unser Leitfaden für eine stressfreie Abiturvorbereitung...</p>
        </article>
      </div>
    </div>
  );
}
