function generateQRCode() {
  const text = document.getElementById("qrText").value;
  const qrDiv = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrDiv.innerHTML = ""; // clear previous QR
  downloadBtn.style.display = "none";

  if (text.trim() === "") {
    alert("Please enter text or URL!");
    return;
  }

  QRCode.toDataURL(text, { width: 256 }, function (err, url) {
    if (err) return console.error(err);

    const img = new Image();
    img.src = url;
    img.alt = "QR Code";
    img.id = "qrImage";
    qrDiv.appendChild(img);

    downloadBtn.href = url;
    downloadBtn.download = "qr-code.png";
    downloadBtn.style.display = "inline-block";
    downloadBtn.onclick = () => {
      downloadBtn.href = url;
    };
  });
}
