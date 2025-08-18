import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CoverPhotoEditor.css";

/**
 * CoverPhotoEditor
 * - Square crop frame (size prop)
 * - Drag to position
 * - Scroll to zoom (trackpad/mouse)
 * - Pinch to zoom (touch)
 * - Keeps the image covering the frame at all times (no gaps)
 * - "Submit" returns a cropped image (PNG) and raw transform data via onSubmit
 *
 * Usage:
 * <CoverPhotoEditor
 *    size={360}
 *    initialImageUrl="/some/cover.jpg"
 *    onSubmit={({ blob, dataUrl, transform }) => { ... }}
 * />
 */
export default function CoverPhotoEditor({
  frameWidth = 360,
  frameHeight = 360,
  initialImageUrl = "",
  maxScale = 8,
  onSubmit = () => {},
}: {
  frameWidth?: number;
  frameHeight?: number;
  initialImageUrl?: string;
  maxScale?: number;
  onSubmit?: (payload: {
    blob: Blob;
    dataUrl: string;
    transform: { scale: number; tx: number; ty: number; minScale: number };
  }) => void;
}) {
  const [imgUrl, setImgUrl] = useState<string>(initialImageUrl);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0); // translateX in px
  const [ty, setTy] = useState(0); // translateY in px
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // multi-pointer state for pinch
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    startTx: number;
    startTy: number;
    center: { x: number; y: number };
  } | null>(null);

  // compute minScale so image always covers the square frame
  const minScale = useMemo(() => {
    if (!imgNatural) return 1;
    const s = Math.max(frameWidth / imgNatural.w, frameHeight / imgNatural.h);
    return s;
  }, [imgNatural, frameWidth, frameHeight]);

  // ensure scale never below min
  useEffect(() => {
    if (!imgNatural) return;
    setScale((prev) => Math.max(prev, minScale));
  }, [minScale, imgNatural]);

  // clamp translation so no gaps
  const clampPosition = (nx: number, ny: number, s: number) => {
    if (!imgNatural) return { x: nx, y: ny };
    const imgW = imgNatural.w * s;
    const imgH = imgNatural.h * s;
    const minX = Math.min(0, frameWidth - imgW);
    const minY = Math.min(0, frameHeight - imgH);
    const maxX = 0;
    const maxY = 0;
    return {
      x: Math.min(Math.max(nx, minX), maxX),
      y: Math.min(Math.max(ny, minY), maxY),
    };
  };

  const setScaleAroundPoint = (newScale: number, cx: number, cy: number) => {
    if (!imgNatural) return;
    const s = Math.min(Math.max(newScale, minScale), maxScale);
    // keep the point (cx, cy) stable during zoom
    const px = (cx - tx) / scale;
    const py = (cy - ty) / scale;
    let nx = cx - px * s;
    let ny = cy - py * s;
    const clamped = clampPosition(nx, ny, s);
    setScale(s);
    setTx(clamped.x);
    setTy(clamped.y);
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!imgNatural) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setScaleAroundPoint(scale * factor, cx, cy);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // initialize pinch
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const center = {
        x: (pts[0].x + pts[1].x) / 2 - rect.left,
        y: (pts[0].y + pts[1].y) / 2 - rect.top,
      };
      pinchRef.current = {
        startDist: dist,
        startScale: scale,
        startTx: tx,
        startTy: ty,
        center,
      };
    } else if (pointers.current.size === 1) {
      setDragging(true);
      dragRef.current = { x: e.clientX - tx, y: e.clientY - ty };
    }
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const p = pointers.current;
    if (!p.has(e.pointerId)) return;
    p.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (p.size === 2 && pinchRef.current) {
      // pinch zoom
      const pts = Array.from(p.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const scaleFactor = dist / pinchRef.current.startDist;
      const targetScale = pinchRef.current.startScale * scaleFactor;
      setScaleAroundPoint(targetScale, pinchRef.current.center.x, pinchRef.current.center.y);
    } else if (dragging && dragRef.current) {
      const nx = e.clientX - dragRef.current.x;
      const ny = e.clientY - dragRef.current.y;
      const clamped = clampPosition(nx, ny, scale);
      setTx(clamped.x);
      setTy(clamped.y);
    }
  };

  const onPointerUpOrCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) {
      setDragging(false);
      dragRef.current = null;
    }
  };

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
  };

  const onImageLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const el = e.currentTarget;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    setImgNatural({ w, h });
    // center image at minScale
    const s = Math.max(frameWidth / w, frameHeight / h);
    const imgW = w * s;
    const imgH = h * s;
    const startX = Math.min(0, (frameWidth - imgW) / 2);
    const startY = Math.min(0, (frameHeight - imgH) / 2);
    setScale(s);
    setTx(startX);
    setTy(startY);
  };

  const doSubmit = async () => {
    if (!imgNatural || !imgUrl) return;
    // draw to canvas at the square size
    const canvas = document.createElement("canvas");
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    await new Promise((res) => (img.onload = res));
    ctx.clearRect(0, 0, frameWidth, frameHeight);
    // We have image in world coords transformed by scale and translate; draw equivalent
    // That means we draw the portion of the image that maps onto the square
    // Compute source rect from inverse transform
    const sx = -tx / scale;
    const sy = -ty / scale;
    const sw = frameWidth / scale;
    const sh = frameHeight / scale;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, frameWidth, frameHeight);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        onSubmit({
          blob,
          dataUrl: String(reader.result),
          transform: { scale, tx, ty, minScale },
        });
      };
      reader.readAsDataURL(blob);
    }, "image/png", 0.95);
  };

  return (
    <div className="bve-editor">
      <div className="bve-controls">
        <label className="bve-btn bve-btn--secondary">
          <span>Upload cover</span>
          <input
            type="file"
            accept="image/*"
            className="bve-hidden-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (!imgNatural) return;
            setScale(minScale);
            const imgW = imgNatural.w * minScale;
            const imgH = imgNatural.h * minScale;
            const startX = Math.min(0, (frameWidth - imgW) / 2);
            const startY = Math.min(0, (frameHeight - imgH) / 2);
            setTx(startX);
            setTy(startY);
          }}
          className="bve-btn"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={doSubmit}
          className="bve-btn bve-btn--primary"
        >
          Submit
        </button>
      </div>

      <div
        ref={containerRef}
        className="bve-frame"
        style={{ width: frameWidth, height: frameHeight }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrCancel}
        onPointerCancel={onPointerUpOrCancel}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            onLoad={onImageLoad}
            alt="cover"
            draggable={false}
            className="bve-image"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            }}
          />
        ) : (
          <div className="bve-placeholder">Drop an image or click Upload</div>
        )}

        <div className="bve-mask">
          <div className="bve-vignette" />
          <div className="bve-border" />
        </div>
      </div>

      <div className="bve-zoom">
        <input
          type="range"
          min={minScale}
          max={maxScale}
          step={0.001}
          value={scale}
          onChange={(e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const cx = rect ? rect.width / 2 : frameWidth / 2;
            const cy = rect ? rect.height / 2 : frameHeight / 2;
            setScaleAroundPoint(parseFloat(e.target.value), cx, cy);
          }}
          className="bve-slider"
        />
        <span className="bve-scale-label">{scale.toFixed(2)}×</span>
      </div>

      <HelpTips />
    </div>
  );
}

function HelpTips() {
  return (
    <div className="bve-tips">
      <p>Drag to reposition. Scroll or pinch to zoom. The image is constrained so there are no empty edges — it must always cover the square.</p>
    </div>
  );
}


