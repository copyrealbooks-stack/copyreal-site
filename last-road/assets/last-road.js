(() => {
  const links = window.LAST_ROAD_LINKS || {};
  const valid = value => {
    try { const url = new URL(value); return url.protocol === 'https:'; } catch { return false; }
  };
  document.querySelectorAll('[data-link-slot]').forEach(slot => {
    const number = Number(slot.dataset.linkSlot);
    const url = links.episodes?.[number];
    const card = slot.closest('.episode');
    const art = card.querySelector('.episode-art');
    const title = card.querySelector('h3').textContent;
    if (!valid(url)) {
      art.setAttribute('aria-label', `${title} — Coming soon`);
      let noticeTimer;
      art.addEventListener('click', () => {
        art.classList.add('is-revealed');
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => art.classList.remove('is-revealed'), 2400);
      });
      slot.replaceChildren(Object.assign(document.createElement('span'), { className: 'release-note', textContent: 'Coming soon' }));
      return;
    }
    art.setAttribute('aria-label', `Watch ${title} on YouTube`);
    art.addEventListener('click', () => window.open(url, '_blank', 'noopener,noreferrer'));
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
