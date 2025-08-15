function generateQRCode() {
  const text = document.getElementById("qrText").value.trim();
  const qrDiv = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrDiv.innerHTML = ""; // clear previous QR
  downloadBtn.style.display = "none";

  if (text === "") {
    alert("Please enter text or URL!");
    return;
  }

  // Generate QR on a canvas
  QRCode.toCanvas(text, { width: 256 }, function (err, canvas) {
    if (err) {
      console.error(err);
      return;
    }

    // Show canvas
    qrDiv.appendChild(canvas);

    // Convert canvas to PNG and set download link
    const imageData = canvas.toDataURL("image/png");
    downloadBtn.href = imageData;
    downloadBtn.download = "qr-code.png";
    downloadBtn.style.display = "inline-block";
  });
}