(function () {
  var root = document.documentElement;

  // ---- theme toggle (persisted) ----
  var tbtn = document.getElementById('theme');
  if (tbtn) tbtn.onclick = function () {
    root.classList.toggle('dark');
    try { localStorage.setItem('ebayprep-theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
  };

  // ---- mobile sidebar ----
  var sb = document.getElementById('sidebar'),
      mb = document.getElementById('menu'),
      sc = document.getElementById('scrim');
  function closeNav() { if (sb) sb.classList.remove('open'); if (sc) sc.classList.remove('show'); }
  if (mb) mb.onclick = function () { if (sb) sb.classList.toggle('open'); if (sc) sc.classList.toggle('show'); };
  if (sc) sc.onclick = closeNav;

  // ---- search ----
  var q = document.getElementById('q'),
      res = document.getElementById('results'),
      data = null;

  function esc(s) { return (s || '').replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function rootPrefix() { return location.pathname.indexOf('/docs/') > -1 ? '../' : ''; }

  function load(cb) {
    if (data) { cb(); return; }
    if (window.SEARCH_DATA) { data = window.SEARCH_DATA; cb(); return; }  // works offline from file://
    fetch(window.SEARCH_JSON).then(function (r) { return r.json(); })
      .then(function (d) { data = d; cb(); })
      .catch(function () { data = []; cb(); });
  }

  function render(items) {
    if (!items.length) { res.innerHTML = '<div class="r-empty">No matches</div>'; res.classList.add('show'); return; }
    res.innerHTML = items.slice(0, 12).map(function (it) {
      return '<a href="' + rootPrefix() + it.url + '"><div class="r-title">' + esc(it.title) + '</div>' +
             '<div class="r-sub">' + esc(it.group) + (it._h ? ' · ' + esc(it._h) : '') + '</div></a>';
    }).join('');
    res.classList.add('show');
  }

  function search(term) {
    term = term.toLowerCase().trim();
    if (!term) { res.classList.remove('show'); return; }
    var out = [];
    data.forEach(function (it) {
      var hay = (it.title + ' ' + it.group + ' ' + (it.headings || []).join(' ') + ' ' + (it.excerpt || '')).toLowerCase();
      if (hay.indexOf(term) > -1) {
        var h = (it.headings || []).filter(function (x) { return x.toLowerCase().indexOf(term) > -1; })[0];
        var copy = {}; for (var k in it) copy[k] = it[k]; copy._h = h;
        out.push(copy);
      }
    });
    render(out);
  }

  if (q) {
    q.addEventListener('input', function () { load(function () { search(q.value); }); });
    q.addEventListener('focus', function () { if (q.value) load(function () { search(q.value); }); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) res.classList.remove('show'); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { res.classList.remove('show'); q.blur(); }
      if (e.key === 'Enter') { var a = res.querySelector('a'); if (a) location.href = a.href; }
    });
  }
})();
