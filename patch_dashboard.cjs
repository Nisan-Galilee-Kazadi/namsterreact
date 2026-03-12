const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Dashboard.jsx');
let text = fs.readFileSync(targetPath, 'utf8');

// 1. Add import for templates
if (!text.includes("import { templates }")) {
    text = text.replace(
        `import { useTranslation } from "react-i18next";`,
        `import { useTranslation } from "react-i18next";\nimport { templates } from "../data/templates";`
    );
}

// 2. Remove the inline templates and fonts array
// We know it starts at "  const templates = [" and ends before "  useEffect(() => {" where renderCanvas is.
const templatesStart = text.indexOf("  const templates = [");
const fontsEnd = text.indexOf("  useEffect(() => {\n    if (selectedTemplate && canvasRef.current)");

if (templatesStart !== -1 && fontsEnd !== -1) {
    text = text.substring(0, templatesStart) + text.substring(fontsEnd);
}

// 3. Update the onClick for "Customize" button
const oldOnClick = `onClick={() => {
                      setSelectedTemplate(tpl);
                      setCustomizationData({
                        ...customizationData,
                        primaryColor: tpl.colors[0],
                        secondaryColor: tpl.colors[1],
                        fontFamily: tpl.defaultFont || "Outfit",
                        textColor: getContrastYIQ(tpl.colors[0]),
                        elementsConfig: tpl.config || {
                          title: { x: null, y: null, size: null },
                          date: { x: null, y: null, size: null },
                          time: { x: null, y: null, size: null },
                          description: { x: null, y: null, size: null },
                          location: { x: null, y: null, size: null },
                          placeholders: { x: null, y: null, size: null }
                        }
                      });
                    }}`;

const newOnClick = `onClick={() => navigate(\`/customize/\${tpl.id}\`)}`;
// We'll replace it using regex just in case formatting slightly differs
text = text.replace(/onClick=\{\(\) => \{\s*setSelectedTemplate\(tpl\);[\s\S]*?\}\}/g, newOnClick);

// 4. Remove the modal AnimatePresence code.
// The modal is inside <AnimatePresence> ... {selectedTemplate && ( ... )} </AnimatePresence>
// Let's find `<AnimatePresence>` at the bottom of the component
const animatePresenceStart = text.lastIndexOf("<AnimatePresence>");
const animatePresenceEnd = text.lastIndexOf("</AnimatePresence>");

if (animatePresenceStart !== -1 && animatePresenceEnd !== -1) {
    text = text.substring(0, animatePresenceStart) + text.substring(animatePresenceEnd + 18);
}

fs.writeFileSync(targetPath, text, 'utf8');
console.log("Dashboard patched successfully!");
