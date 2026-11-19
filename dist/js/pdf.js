'use strict';

const pdfGenerator = (() => {
  async function toJpeg(img) {
    const scale = Math.min(1, 2400 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('processingUnavailable');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.94));
    if (!blob) throw new Error('encodingFailed');
    const width = canvas.width, height = canvas.height;
    canvas.width = canvas.height = 1;
    return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height };
  }

  // Cross-reference offsets count PDF bytes, including the embedded JPEGs.
  function makePdf(pages) {
    const encoder = new TextEncoder();
    const chunks = [];
    const offsets = [0];
    let length = 0;
    function append(value) {
      const bytes = typeof value === 'string' ? encoder.encode(value) : value;
      chunks.push(bytes);
      length += bytes.length;
    }
    function object(id, body) {
      offsets[id] = length;
      append(id + ' 0 obj\n' + body + '\nendobj\n');
    }
    append('%PDF-1.4\n');
    object(1, '<< /Type /Catalog /Pages 2 0 R >>');
    object(2, '<< /Type /Pages /Kids [' + pages.map((_, i) => (3 + i * 3) + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>');
    pages.forEach((page, i) => {
      const id = 3 + i * 3;
      const width = 595.28, height = 841.89, margin = 24;
      const scale = Math.min((width - margin * 2) / page.width, (height - margin * 2) / page.height);
      const w = page.width * scale, h = page.height * scale;
      const placement = [w, 0, 0, h, (width - w) / 2, (height - h) / 2].map(n => n.toFixed(3)).join(' ');
      const content = 'q\n' + placement + ' cm\n/Image Do\nQ\n';
      object(id, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + width + ' ' + height + '] /Resources << /XObject << /Image ' + (id + 1) + ' 0 R >> >> /Contents ' + (id + 2) + ' 0 R >>');
      offsets[id + 1] = length;
      append((id + 1) + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + page.width + ' /Height ' + page.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + page.bytes.length + ' >>\nstream\n');
      append(page.bytes);
      append('\nendstream\nendobj\n');
      object(id + 2, '<< /Length ' + encoder.encode(content).length + ' >>\nstream\n' + content + 'endstream');
    });
    const xref = length;
    append('xref\n0 ' + offsets.length + '\n0000000000 65535 f \n');
    for (let i = 1; i < offsets.length; i++) append(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    append('trailer\n<< /Size ' + offsets.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    return new Blob(chunks, { type: 'application/pdf' });
  }

  return { toJpeg, makePdf };
})();
