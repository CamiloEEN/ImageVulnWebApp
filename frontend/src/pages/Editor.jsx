import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { applyTransformation } from '../utils/applyTransformation';
import './Editor.css';

import { data, defaultChartOptions, createDefaultChartData } from '../utils/chartConfig';
import { useRef, useEffect, useState } from 'react';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { useNavigate } from "react-router-dom";

import {handleImageUpload, handleApply, handlePostImage, handleDownloadImage } from '../utils/editorHandlers';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Editor() {

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  //Para manipular la imagen
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const [chartData, setChartData] = useState(createDefaultChartData(
  Array.from({ length: 256 }, (_, i) => i), // red
  Array.from({ length: 256 }, (_, i) => i), // green
  Array.from({ length: 256 }, (_, i) => i)  // blue
));

  useEffect(() => {
      fetch("http://localhost:8000/me", {
        credentials: "include"
      })
        .then(res => {
          if (!res.ok) {
            navigate("/login");
          } else {
            return res.json();
          }
        })
        .then(data => setUserData(data))
        .catch(() => navigate("/login"));
    }, []);

  useEffect(() => {
  if (!imageSrc || !canvasRef.current || !imageRef.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  const img = imageRef.current;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  }, [imageSrc]);

  //Sincronizar sliders con parametros
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

    //Sincronizar Sliders
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

  return (
    <>
      <Navbar />
      <div className='editor-container'>
        <div className="image-section">
          <h2>Imagen a editar</h2>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImageSrc, canvasRef)} />
          {imageSrc && (
            <div className="image-preview-container">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Imagen subida"
                className="original-image"
              />
              <canvas ref={canvasRef} className="editor-canvas" />
              <button className='apply-button' onClick={() => handleApply({
                  imageRef,
                  canvasRef,
                  q0RedInputRef,
                  q0GreenInputRef,
                  q0BlueInputRef,
                  lambdaRedInputRef,
                  lambdaGreenInputRef,
                  lambdaBlueInputRef,
                  setChartData // si decides implementar gráfica dinámica
                })}>Aplicar transformación</button>
              <button className='post-button' onClick={() => handlePostImage(canvasRef)}>Publicar</button>
              <button className='download-button' onClick={() => handleDownloadImage(canvasRef)}>Descargar</button>
            </div>
          )}
        </div>

        <div className='plot-secction'>
          <h2>Transformación aplicada</h2>
          <div className="plot-placeholder">
            <Line data={chartData} options={defaultChartOptions} />
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
                <input type="range" name="lambdaRedSlider" ref={lambdaRedSliderRef} defaultValue={0} step="0.001" min="0" max="1" />
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
                <input type="range" name="lambdaGreenSlider" ref={lambdaGreenSliderRef} defaultValue={0} step="0.001" min="0" max="1" />
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
                <input type="range" name="lambdaBlueSlider" ref={lambdaBlueSliderRef} defaultValue={0} step="0.001" min="0" max="1" />
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
