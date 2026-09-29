(() => {
  const links = window.LAST_ROAD_LINKS || {};
  const valid = value => {
    try { const url = new URL(value); return url.protocol === 'https:'; } catch { return false; }
  };
  document.querySelectorAll('[data-link-slot]').forEach(slot => {
    const number = Number(slot.dataset.linkSlot);
    const url = links.episodes?.[number];
    if (!valid(url)) return;
    const a = document.createElement('a');
    a.className = 'watch'; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = `Watch episode ${number} on YouTube`;
    slot.replaceChildren(a);
  });
  const playlist = document.querySelector('[data-playlist-slot]');
  if (playlist && valid(links.playlist)) {
    const a = document.createElement('a');
    a.href = links.playlist; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.className = 'button'; a.textContent = 'Watch the full playlist';
    playlist.replaceChildren(a); playlist.hidden = false;
  }
  const book = document.querySelector('[data-book-slot]');
  if (book && valid(links.book)) {
    const a = document.createElement('a');
    a.href = links.book; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.className = 'button ghost'; a.textContent = 'Get the novel';
    book.replaceWith(a);
  }
})();
