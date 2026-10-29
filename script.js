const cards = [document.querySelectorAll(".photo-card")];
const filterButtons = [
   ...document.querySelectorAll(".filter-btn")
];
const gallery = document.getElementById("gallery");
const photoCount = document.getElementById("photo-count");
const modal = document.getElementById("photo-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalCategory = document.getElementById("modal-category");
const modalLocation = document.getElementById("modal-location");
const modalCounter = document.getElementById("modal-counter");
const closeButton = document.getElementById("modal-close");
const previousButton = document.getElementById("modal-prev");
const nextButton = document.getElementById("modal-next");
let visibleCards = [...cards];
let currentIndex = 0;
let lastFocusedElement = null;


function updateCount() {
   const amount = visibleCards.length;
   photoCount.textContent =
       `${amount} ${amount === 1
           ? "imagem encontrada"
           : "imagens encontradas"}`;
}

function applyFilter(filter) {
   filterButtons.forEach(button => {
       const selected = button.dataset.filtro === filter;
       button.classList.toggle("active", selected);
       button.setAttribute("aria-pressed", String(selected));
   });
   gallery.classList.add("filtering");
   window.setTimeout(() => {
       cards.forEach(card => {
           const matches =
               filter === "todos" ||
               card.dataset.categoria === filter;
           card.classList.toggle("hidden", !matches);
       });
       visibleCards = cards.filter(
           card => !card.classList.contains("hidden")
       );
       gallery.classList.toggle(
           "filtered",
           filter !== "todos"
       );
       updateCount();
       gallery.classList.remove("filtering");
   }, 120);
}

function showPhoto(index) {
   if (visibleCards.length === 0) return;
   currentIndex =
       (index + visibleCards.length) % visibleCards.length;
   const card = visibleCards[currentIndex];
   const image = card.querySelector("img");
   modalImage.src = image.src;
   modalImage.alt = image.alt;
   modalTitle.textContent =
       card.dataset.title || "Fotografia";
   modalDescription.textContent =
       card.dataset.description || "";
   modalCategory.textContent =
       (card.dataset.categoryName || "Galeria").toUpperCase();
   modalLocation.textContent =
       card.dataset.location || "Local não informado";
   modalCounter.textContent =
       `${currentIndex + 1} de ${visibleCards.length}`;
   previousButton.disabled = visibleCards.length < 2;
   nextButton.disabled = visibleCards.length < 2;
}

function openModal(card) {
   visibleCards = cards.filter(
       item => !item.classList.contains("hidden")
   );
   const index = visibleCards.indexOf(card);
   if (index < 0) return;
   lastFocusedElement = document.activeElement;
   showPhoto(index);
   modal.classList.add("open");
   modal.setAttribute("aria-hidden", "false");
   document.body.classList.add("modal-open");
   closeButton.focus();
}

function closeModal() {
   modal.classList.remove("open");
   modal.setAttribute("aria-hidden", "true");
   document.body.classList.remove("modal-open");
   if (lastFocusedElement) {
       lastFocusedElement.focus();
   }
}

cards.forEach(card => {
   card.setAttribute("tabindex", "0");
   card.setAttribute("role", "button");
   card.addEventListener("click", () => {
       openModal(card);
   });
   card.addEventListener("keydown", event => {
       if (event.key === "Enter" || event.key === " ") {
           event.preventDefault();
           openModal(card);
       }
   });
});

filterButtons.forEach(button => {
   button.setAttribute(
       "aria-pressed",
       String(button.classList.contains("active"))
   );
   button.addEventListener("click", () => {
       if (modal.classList.contains("open")) {
           closeModal();
       }
       applyFilter(button.dataset.filtro);
   });
});

closeButton.addEventListener("click", closeModal);
previousButton.addEventListener("click", () => {
   showPhoto(currentIndex - 1);
});
nextButton.addEventListener("click", () => {
   showPhoto(currentIndex + 1);
});

modal.addEventListener("click", event => {
   if (event.target.dataset.close === "true") {
       closeModal();
   }
});

document.addEventListener("keydown", event => {
   if (!modal.classList.contains("open")) return;
   if (event.key === "Escape") {
       closeModal();
   }
   if (event.key === "ArrowLeft") {
       showPhoto(currentIndex - 1);
   }
   if (event.key === "ArrowRight") {
       showPhoto(currentIndex + 1);
   }
});

updateCount();