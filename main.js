// ===== Idioma =====
const DEFAULT_LANG = "es";

function getLang() {
  return localStorage.getItem("lang") || DEFAULT_LANG;
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  loadLanguage(); // se encarga de todo

  // marcar botón activo del selector ES/EN
  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase() === lang);
  });
}

function loadLanguage() {
  const lang = getLang();

  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      // --- Menú / tabs (desktop y móvil)
      document.querySelectorAll('.mainnav .tab-btn[data-tab="home"]').forEach(b => (b.textContent = data.menu.home));
      document.querySelectorAll('.mainnav .tab-btn[data-tab="projects"]').forEach(b => (b.textContent = data.menu.projects));
      document.querySelectorAll('.mainnav .tab-btn[data-tab="about"]').forEach(b => (b.textContent = data.menu.about));
      document.querySelectorAll('.mobile-menu .tab-btn[data-tab="home"]').forEach(b => (b.textContent = data.menu.home));
      document.querySelectorAll('.mobile-menu .tab-btn[data-tab="projects"]').forEach(b => (b.textContent = data.menu.projects));
      document.querySelectorAll('.mobile-menu .tab-btn[data-tab="about"]').forEach(b => (b.textContent = data.menu.about));

      // --- Home: encabezados y botones
      const H = data.home;
      document.getElementById("home-featured-title").textContent = H.featured_title;
      document.getElementById("home-viewall").textContent       = H.view_all + " →";
      document.getElementById("home-about-title").textContent   = H.about_title;
      document.getElementById("home-readmore").textContent      = H.read_more + " →";

      // --- About: título + descripciones
      document.getElementById("about-title").textContent        = data.about.title;
      document.getElementById("about-description").textContent  = data.about.description;
      const prev = document.getElementById("about-description-preview");
      if (prev) prev.textContent = data.about.description;

      // --- About: experiencia
      const expContainer = document.getElementById("about-experience");
      expContainer.innerHTML = "";
      (data.about.experience || []).forEach(exp => {
        const div = document.createElement("div");
        div.className = "experience-item";
        div.innerHTML = `
          <div class="exp-header">
            <strong class="exp-role">${exp.role}</strong>
            <span class="exp-period">${exp.period}</span>
          </div>
          <div class="exp-company">${exp.company}</div>
          <p class="exp-details">${exp.details}</p>
        `;
        expContainer.appendChild(div);
      });

      // --- About: hard skills
      const hardList = document.getElementById("about-hard-skills");
      hardList.innerHTML = "";
      (data.about.skills?.hard || []).forEach(s => {
        const li = document.createElement("li");
        li.className = "chip";
        li.textContent = s;
        hardList.appendChild(li);
      });

      // --- About: soft skills
      const softList = document.getElementById("about-soft-skills");
      softList.innerHTML = "";
      (data.about.skills?.soft || []).forEach(s => {
        const li = document.createElement("li");
        li.className = "chip";
        li.textContent = s;
        softList.appendChild(li);
      });

      // --- Proyectos (pestaña completa + destacados)
      renderProjects(data.projects.items);
      renderFeatured(data.projects.items.slice(0, 3));

      // --- Chips de tecnologías (home) y skills dummy
      renderTechs();
      renderSkills(TECHS.map(t => t.label));
    })
    .catch(err => console.error("Error cargando idioma", err));
}

// ===== Navegación por tabs =====
document.addEventListener("click", (e) => {
  const isTab = e.target.classList.contains("tab-btn") || e.target.classList.contains("link-btn");
  if (!isTab) return;

  const tab = e.target.dataset.tab; // "home" | "projects" | "about"
  if (!tab) return;

  document.querySelectorAll(".tab-content").forEach(sec => {
    sec.style.display = sec.id === tab ? "block" : "none";
  });

  const mm = document.getElementById("mobileMenu");
  if (mm && mm.classList.contains("open")) toggleMobileMenu(false);

  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Tech chips =====
const TECHS = [
  { label: "Java" },
  { label: "Spring Boot" },
  { label: "Liferay" },
  { label: "PostgreSQL and MySQL" },
  { label: "Docker" },
  { label: "Git" },
  { label: "Python" },
  { label: "Angular/React" }
];

function renderTechs() {
  const row = document.getElementById("tech-row");
  if (!row) return;
  row.innerHTML = "";
  TECHS.forEach(t => {
    const chip = document.createElement("span");
    chip.className = "tech-chip";
    chip.textContent = t.label;
    row.appendChild(chip);
  });
}

// ===== Skills (About) =====
function renderSkills(list) {
  const target = document.getElementById("skills-list");
  if (!target) return;
  target.innerHTML = "";
  list.forEach(s => {
    const el = document.createElement("span");
    el.className = "skill";
    el.textContent = s;
    target.appendChild(el);
  });
}

// ===== Pestaña Proyectos =====
function renderProjects(items) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const lang = getLang();

  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => (window.location.href = `project.html?id=${p.id}&lang=${lang}`);

    const img = document.createElement("img");
    img.src = `imgs/${p.id}.jpg`;
    img.alt = p.name;

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <div class="card-title">${p.name}</div>
      <div class="card-desc">${p.description}</div>
    `;

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ===== Destacados en Home =====
function renderFeatured(items) {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const lang = getLang();

  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => (window.location.href = `project.html?id=${p.id}&lang=${lang}`);
    card.innerHTML = `
      <img src="imgs/${p.id}.jpg" alt="${p.name}">
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-desc">${p.description}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== Menú móvil =====
function toggleMobileMenu(force) {
  const menu = document.getElementById("mobileMenu");
  const burger = document.querySelector(".hamburger");
  const open = typeof force === "boolean" ? force : !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  if (burger) burger.setAttribute("aria-expanded", String(open));
}

// ===== Init =====
loadLanguage();
// marcar activo al cargar por primera vez
document.querySelectorAll(".lang-switch button").forEach(btn => {
  btn.classList.toggle("active", btn.textContent.toLowerCase() === getLang());
});