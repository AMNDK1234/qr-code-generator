const $ = (id) => document.getElementById(id);

const genBtn = $("genBtn");
const downloadBtn = $("downloadBtn");
const qrDiv = $("qrcode");

genBtn.addEventListener("click", generateQRCode);

async function generateQRCode() {
  const text = $("qrText").value.trim();
  const qrColor = $("qrColor").value;
  const bgColor = $("bgColor").value;
  const size = clamp(parseInt($("qrSize").value || "300", 10), 128, 1024);
  const transparent = $("transparentBg").checked;
  const logoFile = $("logoInput").files[0] || null;

  qrDiv.innerHTML = "";
  downloadBtn.style.display = "none";

  if (!text) {
    alert("Please enter text or URL!");
    return;
  }

  // Create a canvas for QR
  const canvas = document.createElement("canvas");

  // Use high error correction if adding logo
  const ecLevel = logoFile ? "H" : "M";

  await new Promise((resolve, reject) => {
    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        errorCorrectionLevel: ecLevel,
        color: {
          dark: qrColor,                                 // QR modules color
          light: transparent ? "#0000" : bgColor         // transparent or background color
        },
        margin: 2                                         // small quiet-zone
      },
      (err) => (err ? reject(err) : resolve())
    );
  });

  // If logo provided, draw it centered
  if (logoFile) {
    const logoDataURL = await fileToDataURL(logoFile);
    await drawLogoCentered(canvas, logoDataURL);
  }

  // Show on page
  qrDiv.appendChild(canvas);

  // Enable download
  const dataUrl = canvas.toDataURL("image/png");
  downloadBtn.href = dataUrl;
  downloadBtn.download = "qr-code.png";
  downloadBtn.style.display = "inline-block";
}

/* Helpers */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function drawLogoCentered(canvas, logoSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      // Keep logo small (≈18–22% of QR width), tunable
      const logoSize = Math.round(canvas.width * 0.2);
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;

      // Optional: draw white rounded-rect behind logo for contrast
      const pad = Math.round(logoSize * 0.12);
      roundRect(ctx, x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, Math.round(pad * 0.6));
      ctx.fillStyle = "#fff";
      ctx.fill();

      // Draw logo
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve();
    };
    img.onerror = reject;
    img.src = logoSrc;
  });
}

// Rounded rectangle path helper
function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
