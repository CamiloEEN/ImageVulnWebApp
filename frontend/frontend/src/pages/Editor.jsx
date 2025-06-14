import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Editor.css'

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Editor() {

  //link the values of q0
  const [q0Red, setQ0Red] = useState(128); // default value

  const handleQ0RedChange = (value) => {
    const numeric = Number(value);
    if (!isNaN(numeric)) setQ0Red(numeric)
      else{setQ0Red(128)};
  };

  const [q0Green, setQ0Green] = useState(128); // default value

  const handleQ0GreenChange = (value) => {
    const numeric = Number(value);
    if (!isNaN(numeric)) setQ0Green(numeric)
      else{setQ0Green(128)};
  };

  const [q0Blue, setQ0Blue] = useState(128); // default value

  const handleQ0BlueChange = (value) => {
    const numeric = Number(value);
    if (!isNaN(numeric)) setQ0Blue(numeric)
      else{setQ0Blue(128)};
  };

// Plot Data and options
  const data = {
    labels: Array.from({ length: 256 }, (_, i) => i),
    datasets: [
      {
        label: 'Transformación: y = x',
        data: Array.from({ length: 256 }, (_, i) => i),
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Intensidad original' } },
      y: {
        title: { display: true, text: 'Intensidad transformada' },
        min: 0,
        max: 255,
      },
    },
  };

  return (
    <>
    <Navbar />
    <div className='editor-container'>

      <div className='image-section'>
        <h2>Imagen a editar</h2>
        <img src="/NileBend.jpg" alt="Imagen a editar" className="editor-image" />
      </div>

      <div className='plot-secction'>
        <h2>Transformación aplicada</h2>
        <div className="plot-placeholder">
          <Line data={data} options={options} />
        </div>
        <div className='plot-parameters'>

          <div className='red-channel'>
            <p>Red channel:</p>
            <div className='first-row'>
              <label for="valueInput">q0: </label>
              <input type="number" id="valueInput" Value={q0Red} min="0" max="255" onChange={(e) => handleQ0RedChange(e.target.value)} />
              <input type="range" id="valueSlider" Value={q0Red} min="0" max="255" onChange={(e) => handleQ0RedChange(e.target.value)} />
            </div>
            <div className='second-row'>
              <label for="valueInput">P1: </label>
              <input type="number" id="valueInput" defaultValue={0} min="0" max="255" />
              <label for="valueInput">P2: </label>
              <input type="number" id="valueInput" defaultValue={255} min="0" max="255" />
              <label for="valueInput">lambda: </label>
              <input type="number" id="valueInput" min="0" max="1" />
            </div>
            <div className='third-row'>
              <input type="range" id="valueSlider" defaultValue={0} min="0" max="1000" />
            </div>
          </div>

          <div className='green-channel'>
            <p>green channel:</p>
            <div className='first-row'>
              <label for="valueInput">q0: </label>
              <input type="number" id="valueInput"  Value={q0Green} min="0" max="255" onChange={(e) => handleQ0GreenChange(e.target.value)} />
              <input type="range" id="valueSlider" Value={q0Green} min="0" max="255" onChange={(e) => handleQ0GreenChange(e.target.value)} />
            </div>
            <div className='second-row'>
              <label for="valueInput">P1: </label>
              <input type="number" id="valueInput" defaultValue={0} min="0" max="255" />
              <label for="valueInput">P2: </label>
              <input type="number" id="valueInput" defaultValue={255} min="0" max="255" />
              <label for="valueInput">lambda: </label>
              <input type="number" id="valueInput" min="0" max="1" />
            </div>
            <div className='third-row'>
              <input type="range" id="valueSlider" defaultValue={0} min="0" max="1000" />
            </div>
          </div>

          <div className='blue-channel'>
            <p>blue channel:</p>
            <div className='first-row'>
              <label for="valueInput">q0: </label>
              <input type="number" id="valueInput" Value={q0Blue} min="0" max="255" onChange={(e) => handleQ0BlueChange(e.target.value)} />
              <input type="range" id="valueSlider" Value={q0Blue} min="0" max="255" onChange={(e) => handleQ0BlueChange(e.target.value)} />
            </div>
            <div className='second-row'>
              <label for="valueInput">P1: </label>
              <input type="number" id="valueInput" defaultValue={0} min="0" max="255" />
              <label for="valueInput">P2: </label>
              <input type="number" id="valueInput" defaultValue={255} min="0" max="255" />
              <label for="valueInput">lambda: </label>
              <input type="number" id="valueInput" min="0" max="1" />
            </div>
            <div className='third-row'>
              <input type="range" id="valueSlider" defaultValue={0} min="0" max="1000" />
            </div>
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Editor;
