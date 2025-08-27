export async function convertPdfToImage(file) {
  try {
    if (!file) {
      return { imageUrl: "", file: null, error: "No file provided" };
    }

    if (typeof window === "undefined") {
      return { imageUrl: "", file: null, error: "PDF conversion only works in browser" };
    }

    // ✅ Lazy import so SSR never touches DOM APIs
    const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      return { imageUrl: "", file: null, error: "Canvas context not available" };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ imageUrl: "", file: null, error: "Failed to create image blob" });
          return;
        }
        const originalName = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File([blob], `${originalName}.png`, {
          type: "image/png",
        });
        resolve({ imageUrl: URL.createObjectURL(blob), file: imageFile });
      }, "image/png", 1.0);
    });
  } catch (err) {
    return { imageUrl: "", file: null, error: `Failed to convert PDF: ${err?.message || err}` };
  }
}
