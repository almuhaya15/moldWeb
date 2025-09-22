// ================= IMAGE GALLERY =================
const mainImage = document.getElementById("mainImage");
const thumbsContainer = document.querySelector(".thumbnails");

function initGallery(images){
  mainImage.src = images[0];
  thumbsContainer.innerHTML = "";
  images.forEach(img => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.className = "thumb";
    thumbsContainer.appendChild(thumb);

    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      mainImage.classList.add("fade");
      setTimeout(() => mainImage.classList.remove("fade"), 300);
    });
  });

  // Lightbox عند الضغط على الصورة الرئيسية
  mainImage.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    const img = document.createElement("img");
    img.src = mainImage.src;
    img.className = "lightbox-img";

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => overlay.remove());
  });
}

// ================= TABS =================
const tabLinks = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");

if(tabLinks.length > 0 && tabContents.length > 0){
  tabLinks.forEach(link => {
    link.addEventListener("click", () => {
      tabLinks.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(tab => tab.classList.remove("active"));

      link.classList.add("active");
      document.getElementById(link.dataset.tab).classList.add("active");
    });
  });
}

// ================= SCROLL TO RELATED PRODUCTS =================
const relatedBtn = document.getElementById("relatedBtn");
if(relatedBtn){
  relatedBtn.addEventListener("click", () => {
    const relatedSection = document.getElementById("related-products");
    if(relatedSection){
      relatedSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ================= FORM VALIDATION =================
const form = document.querySelector(".quote-form");
if(form){
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const message = form.querySelector("#message").value.trim();

    if(!name || !email || !phone || !message){
      alert("Please fill in all fields.");
      return;
    }

    if(!/\S+@\S+\.\S+/.test(email)){
      alert("Please enter a valid email address.");
      return;
    }

    alert("Thank you! Your request has been submitted.");
    form.reset();
  });
}

// ================= SYNC INFO-BOX HEIGHT =================
function syncInfoBoxHeight(){
  const infoBox = document.querySelector(".info-box");
  if(infoBox && mainImage){
    infoBox.style.height = mainImage.clientHeight + "px";
  }
}
window.addEventListener("load", syncInfoBoxHeight);
window.addEventListener("resize", syncInfoBoxHeight);

// ================= RELATED PRODUCTS CAROUSEL BUTTONS =================
const carousel = document.querySelector(".related-carousel");
if(carousel){
  carousel.style.position = "relative";

  const btnNext = document.createElement("button");
  const btnPrev = document.createElement("button");

  btnNext.innerText = "›";
  btnPrev.innerText = "‹";

  btnNext.className = "carousel-btn next";
  btnPrev.className = "carousel-btn prev";

  carousel.appendChild(btnPrev);
  carousel.appendChild(btnNext);

  btnNext.addEventListener("click", () => {
    carousel.scrollBy({ left: 220, behavior: "smooth" });
  });
  btnPrev.addEventListener("click", () => {
    carousel.scrollBy({ left: -220, behavior: "smooth" });
  });
}

// ================= PAGINATION =================
const itemsPerPage = 5;
const relatedItems = document.querySelectorAll(".related-item");
const pagination = document.getElementById("pagination");
let currentPage = 1;
const totalPages = Math.ceil(relatedItems.length / itemsPerPage);

function showPage(page) {
  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  relatedItems.forEach((item, index) => {
    if(index >= start && index < end){
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });

  renderPagination();
}

function renderPagination() {
  pagination.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "«";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => showPage(currentPage - 1));
  pagination.appendChild(prevBtn);

  for(let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if(i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => showPage(i));
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "»";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => showPage(currentPage + 1));
  pagination.appendChild(nextBtn);
}

showPage(1);

// ================= LOAD PRODUCT DATA FROM JSON =================
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

fetch("../data/products.json") // مسار النسبي من html/product-dtl.html
  .then(res => res.json())
  .then(data => {
    const product = data.find(p => p.id == productId);
    if(product){
      loadProduct(product);
    }
  });

function loadProduct(product){
  // الاسم والوصف القصير
  document.querySelector(".product-info h1").innerText = product.name;
  document.querySelector(".product-info p").innerText = product.shortDescription;

  // الصور
  initGallery(product.images);

  // Description tab
  document.querySelector("#desc p").innerText = product.description;

  document.querySelector("#breadcrumbName").innerText = product.name;
  

   // حقل اسم المنتج في نموذج "Get A Quote"
  document.getElementById("quoteProductName").value = "Product name: " + product.name;


  // Features tab
  const featuresList = document.querySelector("#features ul");
  featuresList.innerHTML = "";
  product.features.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    featuresList.appendChild(li);
  });

  // Keywords tab
  document.querySelector("#keywords p").innerText = product.keywords.join(", ");
}
