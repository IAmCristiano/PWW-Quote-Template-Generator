function generateTemplate() {
    const canvas = document.getElementById('templateCanvas');
    const ctx = canvas.getContext('2d');
  
    const bgFile = document.getElementById('bgImage').files[0];
    const quoteFile = document.getElementById('quoteImage').files[0];
    const logoPosition = document.getElementById('logoPosition').value;
    const caption = document.getElementById('caption').value.trim();
    const speaker = document.getElementById('speakerName').value.trim();
    const source = document.getElementById('sourceText').value.trim();
  
    if (!bgFile) return alert("Please upload a background image.");
  
    const bgImg = new Image();
    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;
      ctx.drawImage(bgImg, 0, 0);
  
      ctx.font = 'bold 24px Arial';
      const lines = getWrappedLines(ctx, caption, canvas.width - 80);
      const captionHeight = lines.length * 30;
      const speakerHeight = speaker ? 30 : 0;
      const sourceHeight = source ? 30 : 0;
      const totalTextHeight = captionHeight + speakerHeight + sourceHeight;
      const padding = 40;
      const barHeight = totalTextHeight + padding;
      const barY = canvas.height - barHeight;
  
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, barY, canvas.width, barHeight);
  
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, barY, canvas.width, barHeight);
  
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
  
      let textY = barY + (barHeight - totalTextHeight) / 2 + 20;
      lines.forEach(line => {
        ctx.fillText(line, canvas.width / 2, textY);
        textY += 30;
      });
  
      if (speaker) {
        ctx.font = '18px Arial';
        ctx.fillText(`- ${speaker}`, canvas.width / 2, textY);
        textY += 25;
      }
  
      if (source) {
        ctx.font = '16px Arial';
        ctx.fillText(`Source: ${source}`, canvas.width / 2, textY);
      }
  
      if (quoteFile) {
        const quoteImg = new Image();
        quoteImg.onload = () => {
          const size = 100;
          const x = canvas.width / 2 - size / 2;
          const y = barY - size - 20;
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(quoteImg, x, y, size, size);
          ctx.restore();
        };
        quoteImg.src = URL.createObjectURL(quoteFile);
      }
  
      const logoImg = new Image();
      logoImg.onload = () => {
        const size = 80;
        const margin = 20;
        const x = logoPosition === 'left' ? margin : canvas.width - size - margin;
        const y = margin;
        ctx.drawImage(logoImg, x, y, size, size);
      };
      logoImg.src = 'logo.png';
    };
  
    bgImg.src = URL.createObjectURL(bgFile);
  }
  
  function downloadImage() {
    const canvas = document.getElementById('templateCanvas');
    const link = document.createElement('a');
    link.download = 'PWW_template.png';
    link.href = canvas.toDataURL();
    link.click();
  }
  
  function getWrappedLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
  
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    return lines;
  }
