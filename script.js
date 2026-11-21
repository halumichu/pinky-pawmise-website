
const listElement = document.getElementById("rescue-list");
const detailElement = document.getElementById("rescue-detail");
const searchElement = document.getElementById("rescue-search");
const sectionTitle = document.getElementById("rescue-title");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function safeURL(value) {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.href);
    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function renderList(keyword = "") {
  const query = keyword.trim().toLocaleLowerCase("vi");

  const results = rescueCenters.filter(center =>
    `${center.name} ${center.location}`
      .toLocaleLowerCase("vi")
      .includes(query)
  );

  listElement.innerHTML = results.length
    ? results.map(center => {
        const image = safeURL(center.image);

        return `
          <article class="rescue-card">
            <div class="rescue-photo">
              ${image
                ? `<img src="${escapeHTML(image)}"
                     alt="${escapeHTML(center.name)}">`
                : `<span>🐾</span>`}
            </div>

            <div class="rescue-info">
              <h3>${escapeHTML(center.name)}</h3>
              <p>${escapeHTML(center.location)}</p>
              <p>${escapeHTML(center.description)}</p>

              <button class="detail-button"
                      data-id="${escapeHTML(center.id)}">
                Xem chi tiết
              </button>
            </div>
          </article>
        `;
      }).join("")
    : "<p>Không tìm thấy trạm cứu hộ phù hợp.</p>";
}

function renderDetail(center) {
  const image = safeURL(center.image);
  const facebook = safeURL(center.facebook);
  const qr = safeURL(center.donationQR);

  const pets = Array.isArray(center.pets)
    ? center.pets
    : [];

  listElement.hidden = true;
  searchElement.hidden = true;
  detailElement.hidden = false;
  sectionTitle.textContent = "Thông tin trạm cứu hộ";

  detailElement.innerHTML = `
    <button class="back-button" id="back-to-list">
      ← Quay lại danh sách
    </button>

    <div class="detail-profile">
      ${image
        ? `<img class="detail-cover"
                 src="${escapeHTML(image)}"
                 alt="${escapeHTML(center.name)}">`
        : ""}

      <h2>${escapeHTML(center.name)}</h2>
      <p>${escapeHTML(center.description)}</p>

      <div class="detail-box">
        <h3>Thông tin liên hệ</h3>
        <p><strong>Khu vực:</strong>
          ${escapeHTML(center.location || "Chưa cập nhật")}
        </p>
        <p><strong>Địa chỉ:</strong>
          ${escapeHTML(center.address || "Chưa cập nhật")}
        </p>
        <p><strong>Điện thoại:</strong>
          ${escapeHTML(center.phone || "Chưa cập nhật")}
        </p>

        ${facebook
          ? `<a href="${escapeHTML(facebook)}"
                target="_blank"
                rel="noopener noreferrer">
                Truy cập Fanpage
              </a>`
          : ""}
      </div>

      <div class="detail-box">
        <h3>Thông tin quyên góp</h3>
        ${qr
          ? `<img class="donation-qr"
                   src="${escapeHTML(qr)}"
                   alt="Mã QR quyên góp của ${escapeHTML(center.name)}">`
          : "<p>Thông tin đang được cập nhật.</p>"}
      </div>

      <div class="detail-box">
        <h3>Các bé đang chờ nhận nuôi</h3>

        ${pets.length
          ? `<div class="pet-grid">
              ${pets.map(pet => {
                const petImage = safeURL(pet.image);
                return `
                  <article class="pet-card">
                    ${petImage
                      ? `<img src="${escapeHTML(petImage)}"
                              alt="${escapeHTML(pet.name)}">`
                      : ""}
                    <h4>${escapeHTML(pet.name)}</h4>
                    <p>${escapeHTML(pet.description)}</p>
                  </article>
                `;
              }).join("")}
            </div>`
          : "<p>Chưa có thông tin nhận nuôi được cập nhật.</p>"}
      </div>
    </div>
  `;

  document.getElementById("back-to-list")
    .addEventListener("click", () => {
      window.location.hash = "tram-cuu-ho";
    });
}

function updateView() {
  const id = decodeURIComponent(
    window.location.hash.slice(1)
  );

  const center = rescueCenters.find(item =>
    item.id === id
  );

  if (center) {
    renderDetail(center);
  } else {
    detailElement.hidden = true;
    listElement.hidden = false;
    searchElement.hidden = false;
    sectionTitle.textContent = "Danh sách trạm cứu hộ";
    renderList(searchElement.value);
  }
}

listElement.addEventListener("click", event => {
  const button = event.target.closest("[data-id]");
  if (!button) return;

  window.location.hash = encodeURIComponent(
    button.dataset.id
  );

  updateView();
  document.getElementById("tram-cuu-ho")
    .scrollIntoView({ behavior: "smooth" });
});

searchElement.addEventListener("input", event => {
  renderList(event.target.value);
});

window.addEventListener("hashchange", updateView);

updateView();
