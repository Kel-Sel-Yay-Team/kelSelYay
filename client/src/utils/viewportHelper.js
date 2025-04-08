// viewportHelpers.js or at the top of your component file
export const lockZoom = () => {
    const meta = document.querySelector('meta[name=viewport]');
    if (!meta) return null;
    const originalContent = meta.getAttribute('content');
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
    return originalContent;
};
  
export const unlockZoom = (originalContent) => {
    const meta = document.querySelector('meta[name=viewport]');
    if (!meta) return;
    meta.setAttribute(
      'content',
      originalContent || 'width=device-width, initial-scale=1.0'
    );
};
  