import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Editor.css';
import { useRef, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Editor() {

  const q0RedInputRef = useRef(null);
  const q0RedSliderRef = useRef(null);
  const q0GreenInputRef = useRef(null);
  const q0GreenSliderRef = useRef(null);
  const q0BlueInputRef = useRef(null);
  const q0BlueSliderRef = useRef(null);

  const lambdaRedInputRef = useRef(null);
  const lambdaGreenInputRef = useRef(null);
  const lambdaBlueInputRef = useRef(null);
  const lambdaRedSliderRef = useRef(null);
  const lambdaGreenSliderRef = useRef(null);
  const lambdaBlueSliderRef = useRef(null);

  useEffect(() => {
    const bindSliderToInput = (input, slider) => {
      input.addEventListener('input', () => {
        const val = (input.value);
        if (!isNaN(val) && val >= 0 && val <= 255) {
          slider.value = val;
        }
      });
      slider.addEventListener('input', () => {
        input.value = slider.value;
      });
    };

    bindSliderToInput(q0RedInputRef.current, q0RedSliderRef.current);
    bindSliderToInput(q0GreenInputRef.current, q0GreenSliderRef.current);
    bindSliderToInput(q0BlueInputRef.current, q0BlueSliderRef.current);

    bindSliderToInput(lambdaRedInputRef.current, lambdaRedSliderRef.current);
    bindSliderToInput(lambdaGreenInputRef.current, lambdaGreenSliderRef.current);
    bindSliderToInput(lambdaBlueInputRef.current, lambdaBlueSliderRef.current);
  }, []);

  const data = {
  labels: Array.from({ length: 256 }, (_, i) => i),
  datasets: [
    {
      label: 'Red',
      data: Array.from({ length: 256 }, (_, i) => i),           // ← tu vector de 256 valores para rojo
      borderColor: 'red',
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
    {
      label: 'Green',
      data: Array.from({ length: 256 }, (_, i) => i*i/255),         // ← tu vector de 256 valores para verde
      borderColor: 'green',
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
    {
      label: 'Blue',
      data: Array.from({ length: 256 }, (_, i) => i),          // ← tu vector de 256 valores para azul
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
                <label htmlFor="q0RedInput">q0: </label>
                <input type="number" name="q0RedInput" ref={q0RedInputRef} defaultValue={128} min="0" max="255" />
                <input type="range" name="q0RedSlider" ref={q0RedSliderRef} defaultValue={128} min="0" max="255" />
              </div>
              <div className='second-row'>
                <label htmlFor="">P1: </label>
                <input type="number" name="P1Red" defaultValue={0} min="0" max="255" />
                <label htmlFor="">P2: </label>
                <input type="number" name="P2Red" defaultValue={255} min="0" max="255" />
                <label htmlFor="">lambda: </label>
                <input type="number" name="lambdaRed" ref={lambdaRedInputRef} defaultValue={0} step="0.001" min="0" max="1" />
              </div>
              <div className='third-row'>
                <input type="range" ref={lambdaRedSliderRef} defaultValue={0} step="0.001" min="0" max="1" />
              </div>
            </div>

            <div className='green-channel'>
              <p>Green channel:</p>
              <div className='first-row'>
                <label htmlFor="q0GreenInput">q0: </label>
                <input type="number" name="q0GreenInput" ref={q0GreenInputRef} defaultValue={128} min="0" max="255" />
                <input type="range" name="q0GreenSlider" ref={q0GreenSliderRef} defaultValue={128} min="0" max="255" />
              </div>
              <div className='second-row'>
                <label htmlFor="">P1: </label>
                <input type="number" name="P1Green" defaultValue={0} min="0" max="255" />
                <label htmlFor="">P2: </label>
                <input type="number" name="P2Green" defaultValue={255} min="0" max="255" />
                <label htmlFor="">lambda: </label>
                <input type="number" name="lambdaGreen" ref={lambdaGreenInputRef} defaultValue={0} step="0.001" min="0" max="1" />
              </div>
              <div className='third-row'>
                <input type="range" ref={lambdaGreenSliderRef} defaultValue={0} step="0.001" min="0" max="1" />
              </div>
            </div>

            <div className='blue-channel'>
              <p>Blue channel:</p>
              <div className='first-row'>
                <label htmlFor="q0BlueInput">q0: </label>
                <input type="number" name="q0BlueInput" ref={q0BlueInputRef} defaultValue={128} min="0" max="255" />
                <input type="range" name="q0BlueSlider" ref={q0BlueSliderRef} defaultValue={128} min="0" max="255" />
              </div>
              <div className='second-row'>
                <label htmlFor="">P1: </label>
                <input type="number" name="P1Blue" defaultValue={0} min="0" max="255" />
                <label htmlFor="">P2: </label>
                <input type="number" name="P2Blue" defaultValue={255} min="0" max="255" />
                <label htmlFor="">lambda: </label>
                <input type="number" name="lambdaBlue" ref={lambdaBlueInputRef} defaultValue={0} step="0.001" min="0" max="1" />
              </div>
              <div className='third-row'>
                <input type="range" ref={lambdaBlueSliderRef} defaultValue={0} step="0.001" min="0" max="1" />
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Editor;
