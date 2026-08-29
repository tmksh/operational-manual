(function () {
  const inSub = /\/(phases|tools)\//.test(location.pathname);
  const root = inSub ? "../" : "";

  const svgIcon = (paths) =>
    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const phaseIcons = {
    "01": svgIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
    "02": svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>'),
    "03": svgIcon('<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/>'),
    "04": svgIcon('<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 7-4 10"/>'),
    "05": svgIcon('<path d="M12 19V5"/><path d="m7 10 5-5 5 5"/><path d="M5 21h14"/>'),
    "06": svgIcon('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>'),
  };

  const tools = [
    ["Cursor", root + "tools/cursor.html", root + "img/logos/cursor.svg"],
    ["GitHub Desktop", root + "tools/github-desktop.html", root + "img/logos/github-desktop.svg"],
    ["GitHub", root + "tools/github.html", root + "img/logos/github.svg"],
    ["Supabase", root + "tools/supabase.html", root + "img/logos/supabase.svg"],
    ["Netlify", root + "tools/netlify.html", root + "img/logos/netlify.svg"],
  ];

  const phases = [
    ["01", "ヒアリング", root + "phases/01-hearing.html", "photo-01-hearing.jpg"],
    ["02", "要件定義", root + "phases/02-requirements.html", "photo-04-kickoff.jpg"],
    ["03", "見積・契約", root + "phases/03-contract.html", "photo-03-contract.jpg"],
    ["04", "開発・検証", root + "phases/04-development.html", "photo-04-build.jpg"],
    ["05", "移行・本番", root + "phases/05-production.html", "photo-05-golive.jpg"],
    ["06", "保守・改善", root + "phases/06-maintenance.html", "photo-06-support.jpg"],
  ];

  const normalize = (path) => (path.endsWith("/") ? path + "index.html" : path);
  const currentPath = normalize(location.pathname);
  const isCurrent = (href) =>
    normalize(new URL(href, location.href).pathname) === currentPath;

  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    const link = (href, label, num, icon) => {
      const active = isCurrent(href) ? "is-current" : "";
      const mark = icon || "";
      const prefix = num ? `<span class="num">${num}</span>` : "";
      return `<a class="${active}" href="${href}">${mark}${prefix}${label}</a>`;
    };

    const toolIcon = (src) =>
      `<img class="nav-icon" src="${src}" alt="">`;

    const inPhases = /\/phases\//.test(location.pathname);
    const inTools = /\/tools\//.test(location.pathname);
    const caret = '<span class="nav-caret" aria-hidden="true"></span>';
    const group = (title, open, body) => `
      <div class="nav-group${open ? " is-open" : ""}">
        <button type="button" class="nav-toggle" aria-expanded="${open}">
          ${title}${caret}
        </button>
        <div class="nav-group-body">${body}</div>
      </div>
    `;

    sidebar.innerHTML = `
      <a class="brand" href="${root}index.html">
        <img class="brand-logo" src="${root}img/logo-shinjidai.png" alt="SHINJIDAI">
        <div class="brand-sub">案件の進め方</div>
      </a>
      <nav class="nav" aria-label="マニュアル">
        ${link(root + "index.html", "全体の流れ")}
        ${group(
          "6つの工程",
          inPhases,
          phases.map(([num, label, href]) => link(href, label, num, phaseIcons[num])).join("")
        )}
        ${group(
          "使うツール",
          inTools,
          link(root + "tools/index.html", "ツール全体の流れ") +
            tools.map(([label, href, src]) => link(href, label, "", toolIcon(src))).join("")
        )}
      </nav>
    `;

    sidebar.querySelectorAll(".nav-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const groupEl = button.closest(".nav-group");
        const open = !groupEl.classList.contains("is-open");
        groupEl.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  const steps = document.getElementById("steps");
  if (steps) {
    const here = phases.find(([, , href]) => isCurrent(href));
    steps.className = "stepbar";
    steps.setAttribute("aria-label", "今どの工程か");
    steps.innerHTML = `
      ${here ? `<img class="stepbar-thumb" src="${root}img/${here[3]}" alt="">` : ""}
      <div class="stepbar-track">
        ${phases
          .map(([num, label, href]) => {
            const active = isCurrent(href) ? "is-current" : "";
            return `<a class="${active}" href="${href}"><span class="num">${num}</span><span class="name">${label}</span></a>`;
          })
          .join("")}
      </div>
    `;
  }

  const toggle = document.getElementById("menu-toggle");
  if (toggle && sidebar) {
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    const setOpen = (open) => {
      sidebar.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!sidebar.classList.contains("is-open"));
    });
    backdrop.addEventListener("click", () => setOpen(false));
  }
})();
