(function () {
  const inSub = /\/(phases|tools)\//.test(location.pathname);
  const root = inSub ? "../" : "";

  const tools = [
    ["Cursor", root + "tools/cursor.html"],
    ["GitHub Desktop", root + "tools/github-desktop.html"],
    ["GitHub", root + "tools/github.html"],
    ["Supabase", root + "tools/supabase.html"],
    ["Netlify", root + "tools/netlify.html"],
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
    const link = (href, label, num) => {
      const active = isCurrent(href) ? "is-current" : "";
      const prefix = num ? `<span class="num">${num}</span>` : "";
      return `<a class="${active}" href="${href}">${prefix}${label}</a>`;
    };

    sidebar.innerHTML = `
      <a class="brand" href="${root}index.html">
        <img class="brand-logo" src="${root}img/logo-shinjidai.png" alt="SHINJIDAI">
        <div class="brand-sub">案件の進め方</div>
      </a>
      <nav class="nav" aria-label="マニュアル">
        ${link(root + "index.html", "全体の流れ")}
        <div class="nav-label">6つの工程</div>
        ${phases.map(([num, label, href]) => link(href, label, num)).join("")}
        <div class="nav-label">使うツール</div>
        ${link(root + "tools/index.html", "ツール全体の流れ")}
        ${tools.map(([label, href]) => link(href, label)).join("")}
      </nav>
    `;
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
