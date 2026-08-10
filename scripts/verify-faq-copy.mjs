import fs from "fs";

const checks = [
  ["src/pages/LandingPage.jsx", ["Locataire", "Propriétaire", "clause FAQ 27", "Votre première location est offerte", "vous gagnez 92$ net", "Interac"]],
  ["src/pages/FaqPage.jsx", ['guestsTab: "Locataire"', 'hostsTab: "Propriétaire"', "clause FAQ 27", "Votre première location est offerte", "**8%** de frais de service"]],
  ["src/pages/singleTrailerTranslations.js", ['guests: "Locataire"', 'hosts: "Propriétaire"', "Votre première location est offerte", "vous gagnez 92$ net"]],
];

let ok = true;
for (const [file, needles] of checks) {
  const text = fs.readFileSync(file, "utf8");
  for (const n of needles) {
    if (!text.includes(n)) {
      console.error("MISSING in", file, ":", n);
      ok = false;
    }
  }
}

const landing = fs.readFileSync("src/pages/LandingPage.jsx", "utf8");
if (/guests: "Invités"/.test(landing) || /hosts: "Hôtes"/.test(landing)) {
  console.error("OLD Invités/Hôtes still in LandingPage");
  ok = false;
}
if (landing.includes("Tu gardes 100%") || landing.includes("tu gardes 100%")) {
  console.error("OLD tutoiement earnings copy still in LandingPage");
  ok = false;
}

console.log(ok ? "VERIFY_OK" : "VERIFY_FAIL");
process.exit(ok ? 0 : 1);
