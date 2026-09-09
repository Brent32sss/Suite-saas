export const processImageWithWatermark = (file, metadata) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        // 1. Dibujar la imagen original
        ctx.drawImage(img, 0, 0);

        // 2. Crear franja inferior traslúcida (9% del alto de la imagen)
        const bannerHeight = canvas.height * 0.09;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        // 3. Configurar tipografía escalable
        const fontSize = Math.max(16, Math.floor(canvas.height * 0.025));
        ctx.font = `${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        
        // 4. Estampar los metadatos
        const text = `Fecha: ${metadata.fecha} | Loc: ${metadata.ubicacion} | Por: ${metadata.usuario}`;
        ctx.fillText(text, 20, canvas.height - (bannerHeight / 2) + (fontSize / 3));

        // 5. Retornar imagen procesada en Base64
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};