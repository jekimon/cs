function getSecId(event) {
  const sId = event.target.id;
  console.log(sId)
}

function addBlock(event) {
  const sId = event.target.id;
  const sectionId = "#" + sId;
  const targetSection = document.querySelector(sectionId);
  let heading = document.createElement("h2");
  heading.innerHTML = "This is a heading block";
  targetSection.append(heading)
}
