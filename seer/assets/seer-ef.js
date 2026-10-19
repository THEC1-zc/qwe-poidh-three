(function () {
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('seer_ef_theme'); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    var toggleBtn = document.getElementById('efThemeToggle');
    if (toggleBtn) {
      var updateLabel = function () {
        var cur = document.documentElement.getAttribute('data-theme') || 'dark';
        toggleBtn.textContent = cur === 'light' ? '☾ Dark EF' : '☀ Light EF';
      };
      updateLabel();
      toggleBtn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('seer_ef_theme', next); } catch (e) {}
        updateLabel();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
