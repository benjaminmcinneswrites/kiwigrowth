(function () {
  "use strict";

  const source = document.querySelector("[data-legal-copy]");
  if (!source) return;

  const chapterHeadings = new Map([
    ["KiwiGrowth Privacy Policy", "privacy-policy"],
    ["KiwiGrowth Disclosure", "public-disclosure"],
  ]);

  const sectionHeadings = new Set([
    "Our Commitment to Your Privacy",
    "Information We Collect",
    "Security",
    "Use of Your Personal Information",
    "Disclosing Your Personal Information",
    "Cookies",
    "Third-Party Cookies and Technologies",
    "Additional Information We Collect",
    "Links to Other Websites",
    "Updates to Our Privacy Policy",
    "Complaints and Contact Information",
    "Nature and Scope of My Advice",
    "Conflicts of Interest or Incentives",
    "Internal Complaints",
    "Dispute Resolution Scheme",
    "Our Duties",
  ]);

  const minorHeadings = new Set([
    "Personal Information Provided by You:",
    "Information Collected Automatically:",
    "Third-Party Services We Utilise Include:",
  ]);

  const listLeadIns = new Set([
    "We use your personal information to:",
    "We are required to:",
  ]);

  const implicitListItems = new Set([
    "Google Analytics",
    "Meta Connect",
    "Omni-max",
  ]);

  const contactDetails = new Set([
    "Financial Services Complaints Limited",
    "Level 4, Sybase House",
    "101 Lambton Quay",
    "Wellington 6011",
    "Telephone: 0800 347 257 (freephone if within New Zealand) or +64 4 472 3725 (if calling outside New Zealand)",
    "Postal: P O Box 5967, Wellington 6140",
    "Email: complaints@fscl.org.nz",
    "Website: https://www.fscl.org.nz/",
  ]);

  const documentElement = document.createElement("article");
  documentElement.className = "legal-document";
  documentElement.setAttribute("aria-label", "KiwiGrowth privacy policy and public disclosure");

  let chapter = null;
  let list = null;
  let contactCard = null;

  const ensureChapter = () => {
    if (chapter) return chapter;
    chapter = document.createElement("section");
    chapter.className = "legal-document__chapter";
    documentElement.append(chapter);
    return chapter;
  };

  source.textContent.replace(/\r/g, "").split("\n").forEach((line) => {
    const text = line.trim();
    if (!text || text === "\u200b") return;

    if (chapterHeadings.has(text)) {
      chapter = document.createElement("section");
      chapter.className = "legal-document__chapter";
      chapter.id = chapterHeadings.get(text);
      const heading = document.createElement("h2");
      heading.textContent = text;
      chapter.append(heading);
      documentElement.append(chapter);
      list = null;
      contactCard = null;
      return;
    }

    if (sectionHeadings.has(text) || minorHeadings.has(text)) {
      const heading = document.createElement(minorHeadings.has(text) ? "h4" : "h3");
      heading.textContent = text;
      ensureChapter().append(heading);
      list = null;
      contactCard = null;
      return;
    }

    if (listLeadIns.has(text)) {
      const heading = document.createElement("h4");
      heading.className = "legal-document__lead-in";
      heading.textContent = text;
      ensureChapter().append(heading);
      list = null;
      contactCard = null;
      return;
    }

    if (contactDetails.has(text)) {
      if (!contactCard) {
        contactCard = document.createElement("address");
        contactCard.className = "legal-contact-card";
        ensureChapter().append(contactCard);
      }
      const detail = document.createElement("p");
      detail.textContent = text;
      contactCard.append(detail);
      list = null;
      return;
    }

    if (text.startsWith("\u2022") || implicitListItems.has(text)) {
      if (!list) {
        list = document.createElement("ul");
        ensureChapter().append(list);
      }
      const item = document.createElement("li");
      item.textContent = implicitListItems.has(text) ? text : text.slice(1).trim();
      list.append(item);
      contactCard = null;
      return;
    }

    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    ensureChapter().append(paragraph);
    list = null;
    contactCard = null;
  });

  source.hidden = true;
  source.insertAdjacentElement("afterend", documentElement);
})();
