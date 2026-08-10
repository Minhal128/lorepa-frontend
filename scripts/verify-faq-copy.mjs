import fs from "fs";

const checks = [
  ["src/pages/LandingPage.jsx", ["Locataire", "Propriétaire", "clause FAQ 27", "8% de frais de service", "Interac"]],
  ["src/pages/FaqPage.jsx", ['guestsTab: "Locataire"', 'hostsTab: "Propriétaire"', "clause FAQ 27", "**8%** de frais de service"]],
  ["src/pages/singleTrailerTranslations.js", ['guests: "Locataire"', 'hosts: "Propriétaire"', "clause FAQ 27", "8% de frais de service"]],
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
if (landing.includes("Vous conservez 85%")) {
  console.error("OLD 85% French still in LandingPage");
  ok = false;
}

console.log(ok ? "VERIFY_OK" : "VERIFY_FAIL");
process.exit(ok ? 0 : 1);
