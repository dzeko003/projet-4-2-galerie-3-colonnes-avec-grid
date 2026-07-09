const PHOTOS = [
  {
    id: 1,
    src: "https://img.rezdy.com/PRODUCT_IMAGE/13699/161c670659c54d67b73cb368c4775d3e28.jpg",
    title: "Le fleuve Congo au crépuscule",
    desc: "Vue sur le fleuve depuis le Djoué, lumière du soir.",
    category: "paysages",
    featured: true,
  },
  {
    id: 2,
    src: "https://www.tribune-eco.cg/wp-content/uploads/2026/06/OS.png",
    title: "salon osiane 2026",
    desc: "salon de l'innovation et de technologie",
    category: "evenements",
  },
  {
    id: 3,
    src: "https://lacongolaise242.org/wp-content/uploads/2023/04/ST-ANNE2.jpg",
    title: "Basilique Sainte-Anne",
    desc: "Toiture verte emblématique, style Art déco.",
    category: "architecture",
  },
  {
    id: 4,
    src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/0a/fd/91/20190116-072701-largejpg.jpg?w=900&h=500&s=1",
    title: "Pont du Djoué",
    desc: "Le pont tire son nom de l'entreprise Ottino à laquelle la société des Batignolles avait confié la réalisation de nombreux ouvrages d'art de la ligne du Chemin de fer Congo Océan. ",
    category: "paysages",
  },
  {
    id: 5,
    src: "https://s.rfi.fr/media/display/dd5982f8-0d95-11ea-8244-005056a98db9/w:1024/p:16x9/brazzaville_0.jpg",
    title: "Pont du 15 Août 1960",
    desc: "La République du Congo (Brazzaville) accède à l'indépendance vis-à-vis de la France",
    category: "architecture",
  },
  {
    id: 6,
    src: "https://fespam.cg/wp-content/uploads/2024/10/Slider_acueil_4-768x513.jpeg",
    title: "Festival panafricain de la musique",
    desc: "Danseurs et percussions en plein centre-ville.",
    category: "evenements",
  },
  {
    id: 7,
    src: "https://infocongo.org/wp-content/uploads/2016/09/marine-2.jpg",
    title: "Forêt de la Bouenza",
    desc: "Canopée dense à quelques heures de la capitale.",
    category: "paysages",
  },
  {
    id: 8,
    src: "https://photos.smugmug.com/Around-the-World/Africa/201910-Congo-Brazzaville/i-SgNjgQL/0/LrGqwZFdtwmQZxdjhgf7V2cMfB628dbj3L27SqrQ6/L/043_Brazzaville.%20Place%20de%20la%20Libert%C3%A9.%20La%20Gare-L.jpg",
    title: "Gare de Brazzaville",
    desc: "Architecture coloniale restaurée, façade ocre.",
    category: "architecture",
  },
  {
    id: 9,
    src: "https://www.journaldebrazza.com/wp-content/uploads/2025/07/fespam2025.jpg",
    title: "Fête de la musique",
    desc: "Scène improvisée, foule du quartier de Bacongo.",
    category: "evenements",
  },
  {
    id: 10,
    src: "https://my-make-bucket.s3.eu-north-1.amazonaws.com/Photos/ncaaez1b8chsm1bnnp8v.webp",
    title: "Chute d'eau",
    desc: "Visiter les chutes de la Loufoulakari , paysage magnifique",
    category: "paysages",
  },
  {
    id: 11,
    src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/fa/a5/70/the-main-facade.jpg?w=900&h=500&s=1",
    title: "Cathédrale Sacré-Cœur",
    desc: "Vitraux et charpente métallique d'époque.",
    category: "architecture",
  },
  {
    id: 12,
    src: "https://pouvoirsafrique.com/pouvoirsafrique/uploads/images/2024/07/24/10862.png",
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
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
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
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
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
