// src/App.jsx
import { useState } from "react";
import reactLogo from './assets/images/react.svg';
import viteLogo from './assets/images/vite.svg';
import heroImg from './assets/images/hero.png';
import icon from './assets/images/icon.svg';
import './App.css';
import TextGenerator from './pdf-extracter.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={icon} className="base" width="170" height="179" alt="Hero" />
          
        </div>
        <div>
         
        </div>
      </section>

      {/* PDF extractor component */}
      <TextGenerator />

      <div className="ticks"></div>
      <section id="next-steps">
       
      </section>
    </>
  );
}

export default App;