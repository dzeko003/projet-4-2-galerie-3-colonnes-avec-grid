const PHOTOS = [
  {
    id: 1,
    src: "https://picsum.photos/seed/congo-fleuve/1000/1000",
    title: "Le fleuve Congo au crépuscule",
    desc: "Vue sur le fleuve depuis le Djoué, lumière du soir.",
    category: "paysages",
    featured: true,
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/congo-marche/700/700",
    title: "Marché de Poto-Poto",
    desc: "Étals colorés et effervescence du matin.",
    category: "evenements",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/congo-basilique/700/700",
    title: "Basilique Sainte-Anne",
    desc: "Toiture verte emblématique, style Art déco.",
    category: "architecture",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/congo-rapides/700/700",
    title: "Rapides de Kintambo",
    desc: "Les eaux vives à la sortie du Pool Malebo.",
    category: "paysages",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/congo-avenue/700/700",
    title: "Avenue de l'Indépendance",
    desc: "Artère centrale au coucher du soleil.",
    category: "architecture",
  },
  {
    id: 6,
    src: "https://picsum.photos/seed/congo-festival/700/700",
    title: "Festival panafricain",
    desc: "Danseurs et percussions en plein centre-ville.",
    category: "evenements",
  },
  {
    id: 7,
    src: "https://picsum.photos/seed/congo-foret/700/700",
    title: "Forêt de la Bouenza",
    desc: "Canopée dense à quelques heures de la capitale.",
    category: "paysages",
  },
  {
    id: 8,
    src: "https://picsum.photos/seed/congo-gare/700/700",
    title: "Gare de Brazzaville",
    desc: "Architecture coloniale restaurée, façade ocre.",
    category: "architecture",
  },
  {
    id: 9,
    src: "https://picsum.photos/seed/congo-musique/700/700",
    title: "Fête de la musique",
    desc: "Scène improvisée, foule du quartier de Bacongo.",
    category: "evenements",
  },
  {
    id: 10,
    src: "https://picsum.photos/seed/congo-plateau/700/700",
    title: "Plateau des Cataractes",
    desc: "Panorama sur les gorges en fin de journée.",
    category: "paysages",
  },
  {
    id: 11,
    src: "https://picsum.photos/seed/congo-cathedrale/700/700",
    title: "Cathédrale Sacré-Cœur",
    desc: "Vitraux et charpente métallique d'époque.",
    category: "architecture",
  },
  {
    id: 12,
    src: "https://picsum.photos/seed/congo-foire/700/700",
    title: "Foire artisanale de Bacongo",
    desc: "Vanneries et tissus wax exposés au grand jour.",
    category: "evenements",
  },
];

const CATEGORY_LABEL = {
  paysages: "Paysages",
  architecture: "Architecture",
  evenements: "Événements",
};

const ITEMS_PER_PAGE = 6;

let currentFilter = "all";
let currentPage = 1;
let visibleList = [];

const galleryEl = document.getElementById("gallery");
const paginationEl = document.getElementById("pagination");
const filtersEl = document.getElementById("filters");

function getFiltered() {
  return currentFilter === "all"
    ? PHOTOS
    : PHOTOS.filter((p) => p.category === currentFilter);
}
function render() {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);
  visibleList = pageItems;

  galleryEl.innerHTML = "";
  pageItems.forEach((photo, i) => {
    const div = document.createElement("div");
    div.className = "item" + (photo.featured ? " featured" : "");
    div.style.animationDelay = i * 0.05 + "s";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", `Agrandir : ${photo.title}`);
    div.dataset.id = photo.id;

    div.innerHTML = `
        <span class="index">${String(photo.id).padStart(2, "0")}/${String(PHOTOS.length).padStart(2, "0")}</span>
        <span class="tag ${photo.category}">${CATEGORY_LABEL[photo.category]}</span>
        <img src="${photo.src}" alt="${photo.title}" loading="${photo.featured ? "eager" : "lazy"}">
        <div class="overlay">
          <h3>${photo.title}</h3>
          <p>${photo.desc}</p>
        </div>
      `;

    const openFromThis = () => openLightbox(photo.id);
    div.addEventListener("click", openFromThis);
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromThis();
      }
    });

    galleryEl.appendChild(div);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  paginationEl.innerHTML = "";
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "‹";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    currentPage--;
    render();
  });
  paginationEl.appendChild(prevBtn);

  const label = document.createElement("span");
  label.textContent = `Page ${currentPage} / ${totalPages}`;
  paginationEl.appendChild(label);

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "›";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    currentPage++;
    render();
  });
  paginationEl.appendChild(nextBtn);
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filtersEl
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  currentPage = 1;
  render();
});

const lightbox = document.getElementById("box");
const lbImage = document.getElementById("boxImage");
const lbTitle = document.getElementById("boxTitle");
const lbDesc = document.getElementById("boxDesc");
let lbIndex = 0;

function openLightbox(photoId) {
  lbIndex = visibleList.findIndex((p) => p.id === photoId);
  if (lbIndex === -1) lbIndex = 0;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}
function updateLightbox() {
  const photo = visibleList[lbIndex];
  lbImage.src = photo.src;
  lbImage.alt = photo.title;
  lbTitle.textContent = photo.title;
  lbDesc.textContent = photo.desc;
}
function showPrev() {
  lbIndex = (lbIndex - 1 + visibleList.length) % visibleList.length;
  updateLightbox();
}
function showNext() {
  lbIndex = (lbIndex + 1) % visibleList.length;
  updateLightbox();
}

document.getElementById("btnClose").addEventListener("click", closeLightbox);
document.getElementById("btnPrev").addEventListener("click", showPrev);
document.getElementById("btnNext").addEventListener("click", showNext);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

render();
