import React, { useMemo } from 'react';

function buildEmbedUrl(videoUrl) {
  if (!videoUrl) {
    return null;
  }

  const videoIdMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!videoIdMatch) {
    return null;
  }

  const videoId = videoIdMatch[1];
  return `https://player.vimeo.com/video/${videoId}`;
}

export default function VimeoPlayer({ videoUrl, title = 'Vídeo do curso' }) {
  const embedUrl = useMemo(() => buildEmbedUrl(videoUrl), [videoUrl]);

  if (!embedUrl) {
    return <p>Não foi possível carregar o player do Vimeo.</p>;
  }

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={embedUrl}
        title={title}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
