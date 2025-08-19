import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './UsersCarousel3D.module.css';

export default function UsersCarousel3D({ images, aspect }) {
  const sliderRef = useRef(null);
  const overlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startDragDegRef = useRef(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
      const deltaX = clientX - startXRef.current;
      const sensitivity = 0.25; // degrees per pixel
      const newDeg = startDragDegRef.current + deltaX * sensitivity;
      slider.style.setProperty('--drag', `${newDeg}deg`);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      slider.classList.remove('dragging');
      overlayRef.current?.classList.remove('dragging');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    setIsDragging(true);
    slider.classList.add('dragging');
    overlayRef.current?.classList.add('dragging');

    startXRef.current = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
    const current = getComputedStyle(slider).getPropertyValue('--drag').trim();
    const parsed = parseFloat(current || '0');
    startDragDegRef.current = isNaN(parsed) ? 0 : parsed;
  };

  const items = images && images.length ? images : ['/assets/User.jpg'];

  // Allow overriding aspect ratio via CSS variable. For 9:16 portrait, set card height ~1.78x width
  const rootStyle = aspect === '9:16' ? { ['--card-h']: 'calc(var(--card-w) * 1.78)' } : undefined;

  return (
    <div className={styles.ucRoot} style={rootStyle}>
      <div
        ref={overlayRef}
        className={styles.dragCapture}
        onPointerDown={handlePointerDown}
        style={{ pointerEvents: 'none' }}
      />
      <div
        ref={sliderRef}
        className={styles.slider}
        style={{ '--quantity': items.length }}
        onPointerDown={handlePointerDown}
      >
        {items.map((src, index) => (
          <div
            key={index}
            className={styles.item}
            style={{ '--position': index + 1 }}
          >
            <img src={src} alt={`user-${index}`} onError={(e)=>{ e.target.src = '/assets/User.jpg'; }} />
          </div>
        ))}
      </div>
    </div>
  );
}

UsersCarousel3D.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  aspect: PropTypes.string,
};


