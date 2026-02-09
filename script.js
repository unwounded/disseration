// Load saved tree or create default
let treeData = JSON.parse(localStorage.getItem("treeData")) || {
  name: "Root",
  collapsed: false,
  children: []
};

// Save tree to browser
function saveTree() {
  localStorage.setItem("treeData", JSON.stringify(treeData));
}

// Render tree
function renderTree() {

  const container = document.getElementById("tree");
  container.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "tree";

  ul.appendChild(createNode(treeData, null));

  container.appendChild(ul);
}


// Create node element
function createNode(node, parent) {

  const li = document.createElement("li");

  const nodeBox = document.createElement("div");
  nodeBox.className = "node";

  // Collapse arrow
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

  // Node name
  const nameSpan = document.createElement("span");
  nameSpan.textContent = node.name;

  nodeBox.appendChild(nameSpan);


  // MAKE CHILD BUTTON
  const addBtn = document.createElement("button");

  addBtn.textContent = "Make Child";

  addBtn.onclick = () => {

    const childName = prompt("Enter child name:");

    if (!childName) return;

    node.children.push({
      name: childName,
      collapsed: false,
      children: []
    });

    saveTree();
    renderTree();
  };

  nodeBox.appendChild(addBtn);


  // RENAME BUTTON  <<< THIS WAS MISSING
  const renameBtn = document.createElement("button");

  renameBtn.textContent = "Rename";

  renameBtn.onclick = () => {

    const newName = prompt("Enter new node name:", node.name);

    if (!newName) return;

    node.name = newName;

    saveTree();
    renderTree();
  };

  nodeBox.appendChild(renameBtn);


  // DELETE BUTTON  <<< THIS WAS MISSING
  if (parent !== null) {

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => {

      if (!confirm("Delete this node?")) return;

      const index = parent.children.indexOf(node);

      if (index > -1) {

        parent.children.splice(index, 1);

      }

      saveTree();
      renderTree();
    };

    nodeBox.appendChild(deleteBtn);
  }


  li.appendChild(nodeBox);


  // Render children
  if (!node.collapsed && node.children.length > 0) {

    const ul = document.createElement("ul");

    node.children.forEach(child => {

      ul.appendChild(createNode(child, node));

    });

    li.appendChild(ul);
  }

  return li;
}


// Export tree
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


// Import tree
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


// Initial render
renderTree();
