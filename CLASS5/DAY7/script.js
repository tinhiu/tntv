// AZUL CODING ---------------------------------------
// JavaScript - Drag & Drop Files & Elements
// https://youtu.be/lSCLnWoa6Tw


// Part 1: Drag & drop files

document.addEventListener("DOMContentLoaded", event => {
  const fileDropzone = document.getElementById("file-dropzone");
  const output = document.getElementById("output");

  if (window.FileList && window.File) {
    fileDropzone.addEventListener("dragover", event => {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      fileDropzone.classList.add("dragover");
    });

    fileDropzone.addEventListener("dragleave", event => {
      fileDropzone.classList.remove("dragover");
    });

    fileDropzone.addEventListener("drop", event => {
      fileDropzone.classList.remove("dragover");
      event.stopPropagation();
      event.preventDefault();

      for (const file of event.dataTransfer.files) {
        const name = file.name;
        const size = file.size ? Math.round(file.size / 1000) : 0;

        if (file.type && file.type.startsWith("image/")) {
            const li = document.createElement("li");
            li.textContent = name + " (" + size + " KB)";
            output.appendChild(li);
        }
      }
    }); 
  }
});



// Part 2: Drag & drop elements

var draggedElement = null;
var items;

function handleDragStart(e) {
    this.style.opacity = "0.4";
    draggedElement = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item", this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) 
        e.preventDefault();

    e.dataTransfer.dropEffect = "move";
    return false;
}

function handleDragEnter(e) {
    this.classList.add("dragover");
}

function handleDragLeave(e) {
    this.classList.remove("dragover");
}

function handleDrop(e) {
    if (e.stopPropagation)
        e.stopPropagation();

    if (draggedElement != this) {
        draggedElement.innerHTML = this.innerHTML;
        draggedElement.setAttribute("data-item", this.innerHTML);

        let replacedItem = e.dataTransfer.getData("item");
        this.innerHTML = replacedItem;
        this.setAttribute("data-item", replacedItem);
    }

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = "1";

    items.forEach(function(item) {
        item.classList.remove("dragover");
    });
}

document.addEventListener("DOMContentLoaded", event => {
    items = document.querySelectorAll(".container .box");

    items.forEach(function(item) {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragenter", handleDragEnter);
      item.addEventListener("dragover", handleDragOver);
      item.addEventListener("dragleave", handleDragLeave);
      item.addEventListener("drop", handleDrop);
      item.addEventListener("dragend", handleDragEnd);
    });
});



// Part 3: Using a plugin

function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function onDragEnter(event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;
    dropzoneElement.classList.add("drop-target");
    draggableElement.classList.add("can-drop");
}

function onDragLeave(event) {
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
}

function onDrop(event) {
    event.target.classList.remove("drop-target");
}

document.addEventListener("DOMContentLoaded", event => {
    window.dragMoveListener = dragMoveListener;

    interact("#dropzoneA").dropzone({
        accept: ".itemA",
        overlap: 0.75,
        ondragenter: onDragEnter,
        ondragleave: onDragLeave,
        ondrop: onDrop
    });

    interact("#dropzoneB").dropzone({
        accept: ".itemB",
        overlap: 0.75,
        ondragenter: onDragEnter,
        ondragleave: onDragLeave,
        ondrop: onDrop
    });

    interact(".draggable").draggable({
        inertia: true,
        autoScroll: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "parent",
                endOnly: true
            })
        ],
        listeners: { 
            move: dragMoveListener
        }
    });
});