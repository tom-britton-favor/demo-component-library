const fs = require("fs");
const path = require("path");
const componentName = process.argv[2];

function toPascalCase(str) {
  // Remove any characters that aren't alphanumeric or spaces
  str = str.replace(/[^\w\s]/g, "");

  // Split the string into an array of words
  let words = str.split(/\s+/);

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  // Join the words back together
  return words.join("");
}

if (!componentName) {
  console.error("Please provide a component name");
  process.exit(1);
}

const componentNamePascal = toPascalCase(componentName);

const componentDir = path.join(__dirname, "src", "components", componentName);

fs.mkdirSync(componentDir, { recursive: true });

const templates = [
  { name: `${componentName}.ts`, template: "index" },
  { name: `${componentName}.css`, template: "css" },
];

templates.forEach(({ name, template }) => {
  const templatePath = path.join(__dirname, "templates", template);
  const filePath = path.join(componentDir, name);

  let content = fs.readFileSync(templatePath, "utf8");
  content = content.replace(/COMPONENT_NAME_PASCAL/g, componentNamePascal);
  content = content.replace(/COMPONENT_NAME/g, componentName);

  fs.writeFileSync(filePath, content);
});
