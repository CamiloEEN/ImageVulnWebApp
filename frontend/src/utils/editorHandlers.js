// src/utils/editorHandlers.js

import { applyTransformation } from "./applyTransformation";
import { createDefaultChartData } from './chartConfig';

export function handleImageUpload(e, setImageSrc, canvasRef) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setImageSrc(reader.result); // Actualiza src de <img>

    // Esperar a que la imagen se cargue antes de dibujarla
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

export async function handleApply({
  imageRef,
  canvasRef,
  q0RedInputRef,
  q0GreenInputRef,
  q0BlueInputRef,
  lambdaRedInputRef,
  lambdaGreenInputRef,
  lambdaBlueInputRef,
  setChartData,
}) {
  const transformParams = {
    red: {
      q0: parseInt(q0RedInputRef.current.value),
      P1: parseInt(document.querySelector('[name="P1Red"]').value),
      P2: parseInt(document.querySelector('[name="P2Red"]').value),
      lambda: parseFloat(lambdaRedInputRef.current.value)
    },
    green: {
      q0: parseInt(q0GreenInputRef.current.value),
      P1: parseInt(document.querySelector('[name="P1Green"]').value),
      P2: parseInt(document.querySelector('[name="P2Green"]').value),
      lambda: parseFloat(lambdaGreenInputRef.current.value)
    },
    blue: {
      q0: parseInt(q0BlueInputRef.current.value),
      P1: parseInt(document.querySelector('[name="P1Blue"]').value),
      P2: parseInt(document.querySelector('[name="P2Blue"]').value),
      lambda: parseFloat(lambdaBlueInputRef.current.value)
    }
  };

  const img = imageRef.current;
  const canvas = canvasRef.current;
  if (!img || !canvas) return;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  try {
    const response = await fetch("http://localhost:8000/transform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(transformParams)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    const { redArray, greenArray, blueArray } = await response.json();
    if (setChartData) {
  setChartData(createDefaultChartData(redArray, greenArray, blueArray));
}

    const resultCanvas = applyTransformation(img, redArray, greenArray, blueArray);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(resultCanvas, 0, 0);

  } catch (err) {
    console.error("❌ Error al enviar transformación:", err);
  }
}

export async function handlePostImage(canvasRef) {
  if (!canvasRef.current) {
    alert("No se encontró el canvas.");
    return;
  }

  const canvas = canvasRef.current;

  canvas.toBlob(async (blob) => {
    if (!blob) {
      alert("No se pudo convertir la imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", blob, "edited_image.png");

    try {
      const uploadResponse = await fetch("http://localhost:8000/upload_edited_image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json();
        alert(`Error al subir imagen: ${err.error}`);
        return;
      }

      const uploadData = await uploadResponse.json();
      const imageId = uploadData.image_id;

      // Ahora crear el post asociado
      const title = prompt("Título de la publicación:");
      const description = prompt("Descripción:");

      const postResponse = await fetch("http://localhost:8000/posts/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          descrition: description,
          image_id: imageId,
        }),
      });

      if (postResponse.ok) {
        alert("✅ Imagen publicada correctamente como post.");
      } else {
        const err = await postResponse.json();
        alert(`Error al crear post: ${err.error}`);
      }

    } catch (err) {
      console.error("❌ Error general:", err);
      alert("Error inesperado al publicar la imagen.");
    }
  }, "image/png");
}

export function handleDownloadImage(canvasRef) {
  if (!canvasRef.current) {
    alert("No se encontró el canvas.");
    return;
  }

  const canvas = canvasRef.current;
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "imagen_editada_by_ImageVulnApp.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
