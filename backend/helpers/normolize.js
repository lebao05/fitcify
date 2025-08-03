function removeVietnameseTones(str) {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFD") // split accents from letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const normalizeString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

module.exports = { removeVietnameseTones, normalizeString };
