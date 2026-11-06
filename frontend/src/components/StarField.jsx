import React from 'react';

/**
 * StarField — Pure CSS animated star field background.
 * Three layers of tiny dots at different drift speeds.
 */
export default function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      <div className="star-layer-3" />
    </div>
  );
}

