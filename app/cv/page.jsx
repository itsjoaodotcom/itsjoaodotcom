"use client";

import { useEffect, useState } from "react";
import "./cv.css";

export default function CvPage() {
  const [datetime, setDatetime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
      const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      setDatetime(`${day} ${date} ${month} \u00B7 PORTO, ${displayHours}:${minutes} ${period}`);
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="cv-page">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-left">
          <span>{datetime}</span>
        </div>
        <div className="status-bar-right">
          <div className="status-signal">
            <span></span><span></span><span></span><span></span>
          </div>
          <div className="status-battery"></div>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-tagline">
          Designer from <strong>Portugal</strong>,<br />
          crafting products that <em>make</em><br />
          complexity <em>feel simple</em>.
        </h1>
        <div className="hero-brand">itsjoao<em>dotcom</em></div>
      </section>

      {/* Experience */}
      <section className="cv-section">
        <div className="experience-list">
          <div className="experience-item">
            <div className="experience-dates">2024 <span>&middot;</span> NOW</div>
            <div className="experience-content">
              <div className="experience-role">Freelancer</div>
              <p className="experience-description">Responsible for designing the platform&apos;s user experience and interface, as well as the marketing website. Developed and implemented the company&apos;s visual identity, ensuring brand consistency across all digital touchpoints.</p>
            </div>
          </div>
          <div className="experience-item">
            <div className="experience-dates">2021 <span>&middot;</span> 2023</div>
            <div className="experience-content">
              <div className="experience-role">
                Head of Design
                <span className="experience-company">
                  <span className="experience-company-icon" style={{ background: "#4a6cf7" }}>B</span>
                  Bordisport
                </span>
              </div>
              <p className="experience-description">Led the design team across all brand touchpoints, from digital experiences to physical product design. Oversaw the creation of performance sportswear collections and built the brand&apos;s e-commerce presence from the ground up.</p>
            </div>
          </div>
          <div className="experience-item">
            <div className="experience-dates">2020 <span>&middot;</span> 2021</div>
            <div className="experience-content">
              <div className="experience-role">
                Head of Design
                <span className="experience-company">
                  <span className="experience-company-icon" style={{ background: "#3b82f6" }}>C</span>
                  Concealed
                </span>
              </div>
              <p className="experience-description">Lead the design team across web apps, desktop software and corporate websites. Defined design systems and UX strategies to ensure consistency and scalability. Worked closely with the development team to streamline implementation and bridge vision with execution across platforms.</p>
            </div>
          </div>
          <div className="experience-item">
            <div className="experience-dates">2020 <span>&middot;</span> 2020</div>
            <div className="experience-content">
              <div className="experience-role">
                Product Designer
                <span className="experience-company">
                  <span className="experience-company-icon" style={{ background: "#3b82f6" }}>W</span>
                  Weasy
                </span>
              </div>
              <p className="experience-description">Designed e-commerce templates and corporate website layouts, focusing on usability, responsiveness and scalable design systems. Contributed to the evolution of the platform by aligning user needs with technical constraints and business goals.</p>
            </div>
          </div>
          <div className="experience-item">
            <div className="experience-dates">2017 <span>&middot;</span> 2019</div>
            <div className="experience-content">
              <div className="experience-role">
                Head of Design
                <span className="experience-company">
                  <span className="experience-company-icon" style={{ background: "#22c55e" }}>S</span>
                  Spar
                </span>
              </div>
              <p className="experience-description">Oversaw all design outputs to ensure alignment with brand guidelines and business objectives. Responsible for maintaining visual consistency across digital and print assets, adapting creative solutions to meet the evolving needs of the brand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="work-section">
        <div className="work-header">
          <h2 className="section-title">/work</h2>
          <div className="work-list">
            {[
              { year: "2025", name: "Website", client: "Clarity" },
              { year: "2025", name: "Branding", client: "Clarity" },
              { year: "2021", name: "Web App", client: "You-ship" },
              { year: "2021", name: "Marketing Website", client: "You-ship" },
              { year: "2021", name: "Mobile App", client: "You-ship" },
              { year: "2020", name: "Desktop App", client: "SimMarket" },
            ].map((w, i) => (
              <div className="work-item" key={i}>
                <span className="work-year">{w.year}</span>
                <span className="work-name">{w.name}</span>
                <span className="work-client">{w.client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <div className="about-layout">
          <h2 className="section-title">/about</h2>
          <div className="about-text">
            <p>I&apos;m a Portuguese Designer based in Porto with over a decade of experience in digital design. Starting my career at 16, I&apos;ve developed an approach that balances strategic thinking with high-quality visual execution, creating products that are both functional and aesthetically refined.</p>
            <p>I focus on UX/UI, turning complex challenges into clear and intuitive experiences. Alongside this, I bring strong visual design skills that ensure interfaces feel engaging, consistent, and aligned with brand identity. I thrive in collaborative environments where ownership, communication, and user focus are key to achieving impactful results.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cv-footer">
        <a href="mailto:hello@itsjoao.com">hello@itsjoao.com</a>
        <div className="footer-links">
          <a href="#">LinkedIn</a>
          <a href="#">Dribbble</a>
          <a href="#">Twitter</a>
        </div>
      </footer>

      <div className="cursor-pen">\</div>
    </div>
  );
}
