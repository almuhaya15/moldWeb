// ======= المتغيرات =======
const categoryLinks = document.querySelectorAll(".sidebar a");
const productsGrid = document.getElementById("productsGrid");
const pagination = document.getElementById("pagination");
const searchInput = document.querySelector(".search input");
const itemsPerPage = 12;

let currentCategory = "all";
let currentPage = 1;
let currentKeyword = ""; // كلمة البحث الحالية

// كل المنتجات (ثابت)
const allProducts = Array.from(productsGrid.children);

// ======= دالة تصفية المنتجات =======
function getFilteredProducts() {
  return allProducts.filter(p => {
    // الفئة
    if (currentCategory !== "all" && !p.querySelector(".product-card").classList.contains(currentCategory)) {
      return false;
    }

    // البحث
    const title = p.querySelector("h3").textContent.toLowerCase();
    const desc = p.querySelector("p").textContent.toLowerCase();
    if (currentKeyword && !title.includes(currentKeyword) && !desc.includes(currentKeyword)) {
      return false;
    }

    return true;
  });
}

// ======= دالة عرض صفحة معينة =======
function showPage(page) {
  currentPage = page;
  const filteredProducts = getFilteredProducts();

  // حالة لا يوجد نتائج
  if (filteredProducts.length === 0) {
    allProducts.forEach(p => (p.style.display = "none"));

    // إزالة أي رسالة قديمة
    let msg = document.getElementById("noResults");
    if (!msg) {
      productsGrid.insertAdjacentHTML(
        "beforeend",
        `
        <div id="noResults" style="text-align:center; grid-column:1/-1; margin:40px 0;">
          <div style="display:inline-block; padding:20px 30px; border:1px solid #ddd; border-radius:12px; background:#f9f9f9; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            <span style="font-size:50px; display:block; margin-bottom:10px; color:#d9534f;">❌</span>
            <p style="font-size:18px; color:#555; margin:0;">No products found</p>
          </div>
        </div>
        `
      );
    }

    // أخفي الباجينيشن
    pagination.innerHTML = "";
    return;
  } else {
    // حذف رسالة noResults لو موجودة
    let msg = document.getElementById("noResults");
    if (msg) msg.remove();
  }

  // إخفاء كل المنتجات أولاً
  allProducts.forEach(p => (p.style.display = "none"));

  // عرض المنتجات الخاصة بالصفحة الحالية
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  filteredProducts.slice(start, end).forEach(p => (p.style.display = "block"));

  updatePagination();
}

// ======= تحديث الباجينيشن =======
function updatePagination() {
  const filteredProducts = getFilteredProducts();
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  pagination.innerHTML = "";

  if (pageCount <= 1) return;

  // زر Prev
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => showPage(currentPage - 1));
  pagination.appendChild(prevBtn);

  // أزرار الأرقام
  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => showPage(i));
    pagination.appendChild(btn);
  }

  // زر Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === pageCount;
  nextBtn.addEventListener("click", () => showPage(currentPage + 1));
  pagination.appendChild(nextBtn);
}

// ======= عند اختيار كاتيجوري =======
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    categoryLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    currentCategory = link.getAttribute("data-category");
    currentPage = 1;

    showLoading();
    setTimeout(() => {
      showPage(currentPage);
      hideLoading();
    }, 300);
  });
});

// ======= مربع البحث =======
let searchTimeout;

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout); // إلغاء أي بحث سابق

  searchTimeout = setTimeout(() => {
    currentKeyword = searchInput.value.toLowerCase().trim();
    currentPage = 1;

    showLoading();
    setTimeout(() => {
      showPage(currentPage);
      hideLoading();
    }, 300);
  }, 950); // 250 مللي ثانية بعد آخر كتابة
});


// ======= اللودر =======
function showLoading() {
  document.getElementById("loadingSpinner").classList.add("show");
}

function hideLoading() {
  document.getElementById("loadingSpinner").classList.remove("show");
}

// ======= تشغيل أول مرة =======
showPage(1);
