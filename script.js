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
        // Define base size based on input image, limiting minimum resolution to 1080x1080 and max to 1080x1350
        const inputWidth = Math.max(1080, Math.min(bgImg.width, 1080));
        const inputHeight = Math.max(1080, Math.min(bgImg.height, 1350));

        canvas.width = inputWidth;
        canvas.height = inputHeight;

        // Draw background image proportionally
        const bgAspect = bgImg.width / bgImg.height;
        const canvasAspect = inputWidth / inputHeight;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (bgAspect > canvasAspect) {
            drawHeight = inputHeight;
            drawWidth = bgImg.width * (inputHeight / bgImg.height);
        } else {
            drawWidth = inputWidth;
            drawHeight = bgImg.height * (inputWidth / bgImg.width);
        }

        offsetX = (inputWidth - drawWidth) / 2;
        offsetY = (inputHeight - drawHeight) / 2;
        ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);

        // Adjust font size based on canvas width
        let baseFontSize = Math.floor(inputWidth / 22);
        ctx.font = `bold ${baseFontSize}px Arial`;
        let lines = getWrappedLines(ctx, caption, inputWidth - 80);

        while (lines.length > 6 && baseFontSize > 18) {
            baseFontSize -= 2;
            ctx.font = `bold ${baseFontSize}px Arial`;
            lines = getWrappedLines(ctx, caption, inputWidth - 80);
        }

        const lineHeight = baseFontSize + 6;
        const speakerSize = Math.floor(baseFontSize * 0.75);
        const sourceSize = Math.floor(baseFontSize * 0.65);

        const captionHeight = lines.length * lineHeight;
        const speakerHeight = speaker ? speakerSize + 8 : 0;
        const sourceHeight = source ? sourceSize + 6 : 0;
        const totalTextHeight = captionHeight + speakerHeight + sourceHeight;
        const padding = 40;
        const barHeight = totalTextHeight + padding;
        const barY = inputHeight - barHeight;

        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, barY, inputWidth, barHeight);

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, barY, inputWidth, barHeight);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        let textY = barY + (barHeight - totalTextHeight) / 2 + baseFontSize;
        ctx.font = `bold ${baseFontSize}px Arial`;
        lines.forEach(line => {
            ctx.fillText(line, inputWidth / 2, textY);
            textY += lineHeight;
        });

        if (speaker) {
            ctx.font = `${speakerSize}px Arial`;
            ctx.fillText(`- ${speaker}`, inputWidth / 2, textY);
            textY += speakerSize + 6;
        }

        if (source) {
            ctx.font = `${sourceSize}px Arial`;
            ctx.fillText(`Source: ${source}`, inputWidth / 2, textY);
        }

        if (quoteFile) {
            const quoteImg = new Image();
            quoteImg.onload = () => {
                const size = 100;
                const x = inputWidth / 2 - size / 2;
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
            const x = logoPosition === 'left' ? margin : inputWidth - size - margin;
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