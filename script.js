// Load saved tree or create a default tree
let treeData = JSON.parse(localStorage.getItem("treeData")) || {
  name: "Root",
  description: "",
  collapsed: false,
  children: []
};

// Save tree function
function saveTree() {
  localStorage.setItem("treeData", JSON.stringify(treeData));
}


// Render tree function
function renderTree() {

  const container = document.getElementById("tree");
  container.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "tree";

  ul.appendChild(createNode(treeData, null));

  container.appendChild(ul);
}


// URL function
function makeLinksClickable(text) {

  if (!text) return "";

  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlPattern, url =>
    `<a href="${url}" target="_blank">${url}</a>`
  );
}


// Create new child
function createNode(node, parent) {

  const li = document.createElement("li");

  const nodeBox = document.createElement("div");
  nodeBox.className = "node";


  // Collapse Child function
  const toggle = document.createElement("span");

  if (node.children.length > 0) {

    toggle.textContent = node.collapsed ? "▶ " : "▼ ";

    toggle.style.cursor = "pointer";

    toggle.onclick = () => {

      node.collapsed = !node.collapsed;

      saveTree();
      renderTree();
    };

  } else {

    toggle.textContent = "• ";

  }

  nodeBox.appendChild(toggle);


  // Name of child
  const nameSpan = document.createElement("span");
  nameSpan.textContent = node.name;

  nodeBox.appendChild(nameSpan);


  // The button MakeChild construction
  const addBtn = document.createElement("button");

  addBtn.textContent = "Make Child";

  addBtn.onclick = () => {

    const childName = prompt("Enter child name:");

    if (!childName) return;

    node.children.push({
      name: childName,
      description: "",
      collapsed: false,
      children: []
    });

    saveTree();
    renderTree();
  };

  nodeBox.appendChild(addBtn);


  // Rename button
  const renameBtn = document.createElement("button");

  renameBtn.textContent = "Rename";

  renameBtn.onclick = () => {

    const newName = prompt("Enter new name:", node.name);

    if (!newName) return;

    node.name = newName;

    saveTree();
    renderTree();
  };

  nodeBox.appendChild(renameBtn);


  // Description button (NEW FEATURE)
  const descBtn = document.createElement("button");

  descBtn.textContent = "Description";

  descBtn.onclick = () => {

    const newDesc = prompt(
      "Enter description (include full URLs starting with https://):",
      node.description || ""
    );

    if (newDesc === null) return;

    node.description = newDesc;

    saveTree();
    renderTree();
  };

  nodeBox.appendChild(descBtn);


  // Delete button
  if (parent !== null) {

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => {

      if (!confirm("Delete node?")) return;

      const index = parent.children.indexOf(node);

      parent.children.splice(index, 1);

      saveTree();
      renderTree();
    };

    nodeBox.appendChild(deleteBtn);
  }


  li.appendChild(nodeBox);


  // Show description (NEW FEATURE)
  if (node.description) {

    const descDiv = document.createElement("div");

    descDiv.style.marginLeft = "20px";
    descDiv.style.fontSize = "0.9em";
    descDiv.style.color = "#333";

    descDiv.innerHTML = makeLinksClickable(node.description);

    li.appendChild(descDiv);
  }


  // collapse all children nodes.
  if (!node.collapsed && node.children.length > 0) {

    const ul = document.createElement("ul");

    node.children.forEach(child => {

      ul.appendChild(createNode(child, node));

    });

    li.appendChild(ul);
  }

  return li;
}


// Export tree function
function exportTree() {

  const blob = new Blob(
    [JSON.stringify(treeData, null, 2)],
    { type: "application/json" }
  );

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "tree.json";

  link.click();
}


// Import tree function
function importTree(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    treeData = JSON.parse(e.target.result);

    saveTree();

    renderTree();
  };

  reader.readAsText(file);
}


// Start
renderTree();
