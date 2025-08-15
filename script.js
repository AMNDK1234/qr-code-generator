function generateQRCode() {
  const text = document.getElementById("qrText").value.trim();
  const qrDiv = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrDiv.innerHTML = ""; // Clear previous QR
  downloadBtn.style.display = "none";

  if (text === "") {
    alert("Please enter text or URL!");
    return;
  }

  // Generate QR and render it as a canvas
  QRCode.toCanvas(text, { width: 256 }, function (err, canvas) {
    if (err) return console.error(err);
    qrDiv.appendChild(canvas);

    // Convert canvas to PNG and enable download
    const imageData = canvas.toDataURL("image/png");
    downloadBtn.href = imageData;
    downloadBtn.download = "qr-code.png";
    downloadBtn.style.display = "inline-block";
  });
}
