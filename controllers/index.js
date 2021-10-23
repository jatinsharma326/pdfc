const cardContent = [
  {
    title: "PDF To Word",
    content: "Convert Pdf to editable word document",
  },
  {
    title: "Word To PDF",
    content: "Convert Word file to PDf",
  },
  {
    title: "PDF To JPG",
    content: "Convert PDF File to JPG",
  },
  {
    title: "JPG To PDF",
    content: "Convert Jpg File to Pdf",
  },
];
const chooseUS = [
  {
    title: "People Trust Us",
    content:
      "Over 500 million users have used our service to simplify their work with digital documents.",
  },
  {
    title: "Businesses Trust Us",
    content:
      "We’re one of the highest-rated PDF software on major B2B software listing platforms: Capterra, G2, and TrustPilot.",
  },
  {
    title: "Our Partners Trust Us",
    content:
      "Unlock bonus features with the Smallpdf Chrome Extension, Google Workspace, and Dropbox App—all free to use.",
  },
  {
    title: "24/7 Customer Support",
    content:
      "Get all the help you need with our round-the-clock customer support.",
  },
  {
    title: "256-Bit TLS Encryption",
    content: "We use 256-bit TLS encryption for secure information transfer.",
  },
  {
    title: "Security Standards",
    content:
      "Your safety is our priority. Smallpdf is ISO 27001, GDPR, and CCPA compliant.",
  },
];
const leftrightContent = [
  {
    heading: "Work Directly on Your Files",
    paragraph:
      "Do more than just view PDFs. Highlight and add text, images, shapes, and freehand annotations to your documents. You can connect to 20 other tools to enhance your files further.",
    anchorTag: "Edit a Pdf now",
    image: "/images/pdf1.jpg",
  },
  {
    heading: "Digital Signatures Made Easy",
    paragraph:
      "Fill in forms, e-sign contracts, and close deals in a few simple steps. You can also request e-signatures and track your document every step of the way.",
    anchorTag: "Edit a Word now",
    image: "/images/pdf2.jpg",
  },
  {
    heading: "Create the Perfect Document",
    paragraph:
      "File too big? Compress it. Need a specific format? Convert it. Things getting chaotic? Merge and split files, or remove excess pages. Smallpdf has it all.",
    anchorTag: "Edit a JPG now",
    image: "/images/pdf3.jpg",
  },
];

module.exports.home = (req, res) => {
  return res.render("index", {
    title: "smallPdf",
    cardContents: cardContent,
    thirdStage: leftrightContent,
    chooseUs: chooseUS,
  });
};
