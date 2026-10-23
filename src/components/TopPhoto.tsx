import React from 'react';
import { SCREEN_IMAGES } from '../data/imagens';

interface Props {
  screen: string;
  title: string;
  subtitle?: string;
  height?: number;
}

export const TopPhoto: React.FC<Props> = ({ screen, title, subtitle, height = 190 }) => {
  const img = SCREEN_IMAGES.find(i => i.screen === screen);
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', flexShrink: 0 }}>
      {img ? (
        <img
          src={img.url}
          alt={img.alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#5C3A1E,#3B2A20)' }} />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(247,241,232,0) 65%, #F7F1E8 100%)',
        }}
      />
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 600, lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, marginTop: 4, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
