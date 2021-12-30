"use strict";

let elements = document.getElementsByClassName('date');
let previous = '';
let marker = false;
for (let j=0; j<elements.length; j++) {
  if (elements[j].textContent != previous && previous) marker = !marker;
  if (marker) elements[j].parentNode.className="table-danger";
  previous = elements[j].textContent; 
}
