var modal = document.querySelector("#colorModal");
var span = document.getElementsByClassName("closeBtn")[0];

function rgb2hex(rgb) {
	rgb = rgb.match(
		/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
	);
	return rgb && rgb.length === 4
		? "#" +
				("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
		: "";
}

function printColor() {
	var getPreview = document.querySelector("#gradientPreview");
	var latestColor = getPreview.style.background;
	// console.log(latestColor);
	document.querySelector("#gText").innerHTML = latestColor;
}

function delIcon() {
	const tabs = document.querySelectorAll(".tablinks");
	if (tabs.length <= 2) {
		const delIcons = document.getElementsByClassName("remove");
		for (d = 0; d < delIcons.length; d++) {
			const delIcon = delIcons[d];
			delIcon.style.display = "none";
		}
	} else {
		const delIcons = document.getElementsByClassName("remove");
		for (d = 0; d < delIcons.length; d++) {
			const delIcon = delIcons[d];
			delIcon.style.display = "block";
		}
	}
}

function getColorId(event) {
	event.preventDefault();
	var ol = event.target.id;
	document.querySelector("#gTabId").innerHTML = ol;
	document.querySelector("#text-helper").style.display = "flex";
	var el = document.getElementById(ol);
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("background") || "FAIL";
	var gp = tr
		.replace("rgba(0, 0, 0, 0) ", "")
		.replace(" repeat scroll 0% 0% / auto padding-box border-box", "");
	var gl = gp.includes("linear");
	var gr = gp.includes("radial");
	var so = gp.includes("gradient");
	var gradStops = [];
	if (gl) {
		var gpl = gp.replace("(rgb(", "(180deg, rgb(");
		var gps = gpl.split("deg, ");
		var gps1 = gps[0].split("(");
		var gType = gps1[0];
		var gDeg = gps1[1];
		var gps2 = gps[1]
			.replace("%)", "%")
			.replaceAll("%, ", "% - ")
			.replaceAll(") ", ") / ");
		var grStops = gps2.split(" - ");
		for (i = 0; i < grStops.length; i++) {
			const grStop = grStops[i];
			gradStops.push(grStop);
		}
	} else if (gr) {
		var gps = gp.split("t(");
		var gType = gps[0].replace("n", "nt");
		var gps2 = gps[1]
			.replace("%)", "%")
			.replaceAll("%, ", "% - ")
			.replaceAll(") ", ") / ");
		var grStops = gps2.split(" - ");
		for (i = 0; i < grStops.length; i++) {
			const grStop = grStops[i];
			gradStops.push(grStop);
		}
	} else if (so == false) {
		var gType = "solid-color";
		var getSolid = gp.replace(
			" none repeat scroll 0% 0% / auto padding-box border-box",
			""
		);
		var solidColor = getSolid.replace(" none", "");
		gradStops.push(solidColor);
	}

	const gStops = gradStops;
	var ColorStops = [];

	for (l = 0; l < gStops.length; l++) {
		const gStop = gStops[l];
		const gStopSplit = gStop.split(" / ");
		const hex = rgb2hex(gStopSplit[0]);
		const perc = gStopSplit[1];
		var percent = parseInt(perc);
		const clrStp = hex + " " + percent + "%";
		ColorStops.push(clrStp);

		const ColorContainer = document.querySelector("#ColorTabs");
		const ColorContents = document.querySelector("#ColorContents");
		const addtab = document.querySelector("#addColorTab");
		const newTabIndex = l + 1;
		const newColorId = "color" + (l + 1);

		// create color tabs
		const ColorTab = document.createElement("button");
		ColorTab.id = "tab-" + newColorId;
		ColorTab.className = "tablinks";
		ColorTab.setAttribute(
			"onClick",
			"JavaScript:selectTab(" + newTabIndex + ");"
		);
		ColorTab.style.background = hex;

		// sets the tab limit to 10
		var colSum = gStops.length;
		if (colSum == 10) {
			addtab.style.display = "none";
		}

		// create color tab contents
		const ColorContent = document.createElement("div");
		ColorContent.className = "colorTabContent";
		ColorContent.id = "cont-" + newColorId;

		// create color picker container
		const ColorGradientStop = document.createElement("div");
		ColorGradientStop.className = "colorStop";

		// color picker input field
		const ColorInput = document.createElement("input");
		ColorInput.value = hex;
		ColorInput.setAttribute("type", "color");
		ColorInput.setAttribute("onchange", "setColor()");
		ColorInput.id = "input-" + newColorId;
		ColorInput.className = "colorInputPicker";

		// color picker text field
		const ColorText = document.createElement("input");
		ColorText.value = hex;
		ColorText.className = "hexcode";
		ColorText.id = "title-" + newColorId;
		ColorText.setAttribute("onchange", "setColorHex()");

		// append input and text to color picker container
		ColorGradientStop.appendChild(ColorInput);
		ColorGradientStop.appendChild(ColorText);

		// create color position container
		const ColorPositions = document.createElement("div");
		ColorPositions.className = "colorPos";
		ColorPositions.id = "ColorPos";

		// color position input slider
		const ColorSlides = document.createElement("input");
		ColorSlides.setAttribute("type", "range");
		ColorSlides.id = "pos-" + newColorId;
		ColorSlides.className = "posSlider";
		ColorSlides.setAttribute("onchange", "setColor()");
		ColorSlides.setAttribute("min", "0");
		ColorSlides.setAttribute("max", "100");
		ColorSlides.value = Number(percent);

		// color position text field
		const ColorDisplay = document.createElement("input");
		ColorDisplay.className = "posDisplay";
		ColorDisplay.id = "dis-" + newColorId;
		ColorDisplay.setAttribute("onchange", "setColor()");
		ColorDisplay.value = percent;

		// append slider & text to color position container
		ColorPositions.appendChild(ColorSlides);
		ColorPositions.appendChild(ColorDisplay);

		//append color picker & position to color content
		ColorContent.appendChild(ColorGradientStop);
		ColorContent.appendChild(ColorPositions);

		// this adds delete icon to color tabs when color tabs are morethan 2

		const ColorRemove = document.createElement("button");
		ColorRemove.setAttribute("onclick", "delColor()");
		ColorRemove.className = "remove";
		ColorRemove.innerHTML = "✖";
		ColorContent.appendChild(ColorRemove);

		ColorContainer.appendChild(ColorTab);
		ColorContents.appendChild(ColorContent);
		document.querySelector("#tab-color1").click();
	}

	const clr_stops = ColorStops.toString();
	const gradientstops = clr_stops.replaceAll(",", ", ");
	const gradientBox = document.querySelector("#gradientPreview");
	const degControl = document.querySelector("#deg");
	const degDisplay = document.querySelector("#degDisplay");
	const degPreview = document.querySelector("#degCircle");
	const colorsTabs = document.querySelector("#ColorTabGroup");
	const degControls = document.querySelector("#degWrapper");
	const degController = document.querySelector("#degController");
	const deg_colors = document.querySelector("#colorSet");
	const colPositions = document.querySelector("#ColorPos");

	var getPreview = document.querySelector("#gradientPreview");
	// color type controls
	if (gType == "linear-gradient") {
		var currentGradient = gType + "(" + gDeg + "deg, " + gradientstops + ")";
		const linearButton = document.querySelector("#linearGradient");
		const degText = document.querySelector("#degValue");
		const degAngle = document.querySelector("#indicator");
		degText.innerHTML = gDeg;
		degAngle.style.transform = "rotate(" + degText.innerHTML + "deg)";
		const curDeg = document.querySelector("#degValue");
		gradientBox.style.background = currentGradient;
		degPreview.style.transform = "rotate(" + (gDeg - 180) + "deg)";
		degControl.value = gDeg;
		degDisplay.value = gDeg;
		linearButton.checked = true;
		deg_colors.style.display = "flex";
		colorsTabs.style.display = "flex";
		degControls.style.display = "flex";
		degController.style.display = "flex";
		colPositions.style.display = "flex";
		linearButton.click();
		printColor();
	} else if (gType == "radial-gradient") {
		const rStops = "73.50% 73.50% at 50.00% 50.00%, ";
		var currentGradient = gType + "(" + rStops + gradientstops + ")";
		const radialButton = document.querySelector("#radialGradient");
		gradientBox.style.background = currentGradient;
		radialButton.checked = true;
		deg_colors.style.display = "flex";
		colorsTabs.style.display = "flex";
		degControls.style.display = "none";
		degController.style.display = "none";
		colPositions.style.display = "flex";
		radialButton.click();
		printColor();
	} else if (gType == "solid-color") {
		const solidButton = document.querySelector("#solidColor");
		const color1 = document.querySelector("#input-color1").value;
		solidButton.checked = true;
		deg_colors.style.display = "none";
		colorsTabs.style.display = "none";
		degControls.style.display = "none";
		degController.style.display = "none";
		colPositions.style.display = "none";
		gradientBox.style.background = color1;
		document.querySelector("#tab-color1").click();
		solidButton.click();
		printColor();
	}
	modal.style.display = "flex";
	const modalId = modal.id;
	delIcon();
	modal.classList.add("open");
}

function setColor() {
	var allColors = [];
	var solidCol = [];
	const colors = document.querySelectorAll(".colorInputPicker");
	for (let i = 0; i < colors.length; i++) {
		const sliId = "pos-color" + (i + 1);
		const disId = "dis-color" + (i + 1);
		const cStops = colors[i].value;
		const cPerc = document.getElementById(sliId);
		const colorValue = cStops + " " + cPerc.value + "%";
		const colorSolid = cStops;
		solidCol.push(colorSolid);
		allColors.push(colorValue);
	}
	const getColors = allColors.toString();
	const colorStops = getColors.replaceAll(",", ", ");
	const gradientBox = document.querySelector("#gradientPreview");
	const setDeg = document.querySelector("#degValue").innerHTML;
	const colorTabs = document.querySelectorAll(".tablinks");

	for (i = 0; i < colorTabs.length; i++) {
		const colorTab = colorTabs[i];
		const tabId = "input-color" + (i + 1);
		const titleId = "title-color" + (i + 1);
		const newColorHex = document.getElementById(tabId).value;
		document.getElementById(titleId).value = newColorHex;
		colorTab.style.background = newColorHex;
	}

	// color type tab controls
	const linear = document.querySelector("#linearGradient").checked;
	const radial = document.querySelector("#radialGradient").checked;
	const solid = document.querySelector("#solidColor").checked;
	const colorsTabs = document.querySelector("#ColorTabGroup");
	const degControls = document.querySelector("#degWrapper");
	const colPositions = document.querySelector("#ColorPos");
	const degController = document.querySelector("#degController");
	const deg_colors = document.querySelector("#colorSet");

	var getPreview = document.querySelector("#gradientPreview");
	if (linear) {
		const setGradient = "linear-gradient(" + setDeg + "deg, " + colorStops + ")";
		deg_colors.style.display = "flex";
		colorsTabs.style.display = "flex";
		degControls.style.display = "flex";
		degController.style.display = "flex";
		colPositions.style.display = "flex";
		gradientBox.style.background = setGradient;
		delIcon();
		const CoPos = document.querySelectorAll(".colorPos");
		for (i = 0; i < CoPos.length; i++) {
			const co_pos = CoPos[i];
			co_pos.style.display = "flex";
		}
		if (colorTabs.length < 2) {
			document.querySelector("#addColorTab").click();
		}
		const latestColor = getPreview.style.background;
		document.querySelector("#gText").innerHTML = setGradient;
	} else if (radial) {
		const setGradient = "radial-gradient(" + colorStops + ")";
		deg_colors.style.display = "flex";
		colorsTabs.style.display = "flex";
		degControls.style.display = "none";
		degController.style.display = "none";
		colPositions.style.display = "flex";
		delIcon();
		const CoPos = document.querySelectorAll(".colorPos");
		for (i = 0; i < CoPos.length; i++) {
			const co_pos = CoPos[i];
			co_pos.style.display = "flex";
		}
		gradientBox.style.background = setGradient;
		if (colorTabs.length < 2) {
			document.querySelector("#addColorTab").click();
		}
		const latestColor = getPreview.style.background;
		document.querySelector("#gText").innerHTML = setGradient;
	} else if (solid) {
		const setGradient = document.querySelector("#tab-color1").style.background;
		const del1Icon = document.querySelector("#cont-color1 .remove");
		del1Icon.style.display = "none";
		deg_colors.style.display = "none";
		colorsTabs.style.display = "none";
		degControls.style.display = "none";
		degController.style.display = "none";
		colPositions.style.display = "none";
		document.querySelector("#tab-color1").click();
		const CoPos = document.querySelectorAll(".colorPos");
		for (i = 0; i < CoPos.length; i++) {
			const co_pos = CoPos[i];
			co_pos.style.display = "none";
		}
		gradientBox.style.background = setGradient;
		if (colorTabs.length < 2) {
			document.querySelector("#addColorTab").click();
		}
		const latestColor = getPreview.style.background;
		document.querySelector("#gText").innerHTML = setGradient;
	}
}

setColor();

const degrees = document.querySelector("#deg");
const display = document.querySelector("#degDisplay");
display.value = degrees.value;
degrees.addEventListener(
	"input",
	function () {
		display.value = degrees.value;
		document.querySelector("#degCircle").style.transform =
			"rotate(" + (degrees.value - 180) + "deg)";
	},
	false
);

display.addEventListener(
	"input",
	function () {
		degrees.value = display.value;
	},
	false
);

function setColorHex() {
	const hexCodes = document.querySelectorAll(".hexcode");
	for (i = 0; i < hexCodes.length; i++) {
		const hexCode = hexCodes[i];
		const inputId = "input-color" + (i + 1);
		const titleId = "title-color" + (i + 1);
		const newHexCode = document.getElementById(titleId).value;
		document.getElementById(inputId).value = newHexCode;
	}
	setColor();
}

var colorPreview = document.querySelector("#gradientPreview");
var textHelper = document.querySelector("#gText");

function addTab() {
	const allTabs = document.querySelectorAll(".colorTabContent");
	var tabLength = allTabs.length;
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	var random = "rgb(" + r + "," + g + "," + b + ")";
	var hex = rgb2hex(random);

	const ColorContainer = document.querySelector("#ColorTabs");
	const ColorContents = document.querySelector("#ColorContents");
	const addtab = document.querySelector("#addColorTab");
	const newTabIndex = tabLength + 1;
	const newColorId = "color" + (tabLength + 1);

	// create color tabs
	const ColorTab = document.createElement("button");
	ColorTab.id = "tab-" + newColorId;
	ColorTab.className = "tablinks";
	ColorTab.setAttribute("onClick", "JavaScript:selectTab(" + newTabIndex + ");");
	ColorTab.style.background = hex;

	// sets the tab limit to 10
	var colSum = tabLength + 1;
	if (colSum == 10) {
		addtab.style.display = "none";
	}
	const delIcons = document.getElementsByClassName("remove");
	if (colSum > 2) {
		for (d = 0; d < delIcons.length; d++) {
			const delIcon = delIcons[d];
			delIcon.style.display = "block";
		}
	}

	// create color tab contents
	const ColorContent = document.createElement("div");
	ColorContent.className = "colorTabContent";
	ColorContent.id = "cont-" + newColorId;

	// create color picker container
	const ColorGradientStop = document.createElement("div");
	ColorGradientStop.className = "colorStop";

	// color picker input field
	const ColorInput = document.createElement("input");
	ColorInput.value = hex;
	ColorInput.setAttribute("type", "color");
	ColorInput.setAttribute("onchange", "setColor()");
	ColorInput.id = "input-" + newColorId;
	ColorInput.className = "colorInputPicker";

	// color picker text field
	const ColorText = document.createElement("input");
	ColorText.value = hex;
	ColorText.className = "hexcode";
	ColorText.id = "title-" + newColorId;
	ColorText.setAttribute("onchange", "setColorHex()");

	// append input and text to color picker container
	ColorGradientStop.appendChild(ColorInput);
	ColorGradientStop.appendChild(ColorText);

	// create color position container
	const ColorPositions = document.createElement("div");
	ColorPositions.className = "colorPos";
	ColorPositions.id = "ColorPos";

	// color position input slider
	const ColorSlides = document.createElement("input");
	ColorSlides.setAttribute("type", "range");
	ColorSlides.id = "pos-" + newColorId;
	ColorSlides.className = "posSlider";
	ColorSlides.setAttribute("onchange", "setColor()");
	ColorSlides.setAttribute("min", "0");
	ColorSlides.setAttribute("max", "100");

	// color position text field
	const ColorDisplay = document.createElement("input");
	ColorDisplay.className = "posDisplay";
	ColorDisplay.id = "dis-" + newColorId;
	ColorDisplay.setAttribute("onchange", "setColor()");

	// append slider & text to color position container
	ColorPositions.appendChild(ColorSlides);
	ColorPositions.appendChild(ColorDisplay);

	//append color picker & position to color content
	ColorContent.appendChild(ColorGradientStop);
	ColorContent.appendChild(ColorPositions);

	// this adds delete icon to color tabs when color tabs are morethan 2
	const ColorRemove = document.createElement("button");
	ColorRemove.setAttribute("onclick", "delColor()");
	ColorRemove.className = "remove";
	ColorRemove.innerHTML = "✖";
	ColorContent.appendChild(ColorRemove);

	ColorContainer.appendChild(ColorTab);
	ColorContents.appendChild(ColorContent);

	const posSliders = document.querySelectorAll(".posSlider");
	for (m = 0; m < posSliders.length; m++) {
		const posSlider = posSliders[m];
		const posSliderLength = posSliders.length - 1;
		const getPosValue = (100 / posSliderLength) * m;
		var posValue = Math.round(getPosValue);
		const posDisplayId = "dis-color" + (m + 1);
		const posDisplay = document.getElementById(posDisplayId);
		posDisplay.value = posValue;
		posSlider.value = posValue;
	}
	setColor();
}

// color Tabs
function selectTab(tabIndex) {
	//Hide All Tabs
	const tabTriggers = document.querySelectorAll(".tablinks");
	for (i = 0; i < tabTriggers.length; i++) {
		const tabTrigger = tabTriggers[i];
		tabTrigger.classList.remove("active");
	}
	const tabContents = document.querySelectorAll(".colorTabContent");
	for (i = 0; i < tabContents.length; i++) {
		const tabContent = tabContents[i];
		tabContent.style.display = "none";
		tabContent.classList.remove("active");
	}
	//Show the Selected Tab
	const tabTriggerId = "tab-color" + tabIndex;
	const tabContentId = "cont-color" + tabIndex;
	const tabTrigger = document.getElementById(tabTriggerId);
	const tabContent = document.getElementById(tabContentId);
	tabTrigger.classList.add("active");
	tabContent.style.display = "flex";
	tabContent.classList.add("active");
}

function delColor() {
	var tabId = document.querySelector(".active").id;
	const posId = tabId.replace("tab", "dis");
	const contId = tabId.replace("tab-", "cont-");
	const tabC = document.getElementById(tabId).style.background;
	const tabP = document.getElementById(posId).value + "%";
	const selStop = ", " + tabC + " " + tabP;
	const colTab = document.getElementById(tabId);
	const prevColor = colTab.previousElementSibling;
	const nextColor = colTab.nextElementSibling;
	const colCont = document.getElementById(contId);
	colTab.remove();
	colCont.remove();

	if (tabId == "tab-color1") {
		nextColor.classList.add("active");
		nextColor.click();
	} else {
		prevColor.classList.add("active");
		prevColor.click();
	}

	const colorTabs = document.querySelectorAll(".tablinks");
	const addtab = document.querySelector("#addColorTab");
	const tabLength = colorTabs.length - 1;
	if (tabLength < 10) {
		addtab.style.display = "flex";
	}

	// update the color tab ids
	for (a = 0; a < colorTabs.length; a++) {
		const colorTab = colorTabs[a];
		var updatedIndex = a + 1;
		const newId = "tab-color" + updatedIndex;
		const newIndexId = "JavaScript:selectTab(" + (a + 1) + ");";
		colorTab.id = newId;
		colorTab.setAttribute("onClick", newIndexId);
	}

	delIcon();

	// update the color content ids
	const colorContents = document.querySelectorAll(".colorTabContent");
	for (b = 0; b < colorContents.length; b++) {
		const colContent = colorContents[b];
		const colorContent = colorContents[b].children;
		const colorPicker = colorContent[0].children;
		const colorPosition = colorContent[1].children;
		const newId = b + 1;
		const colorPicker_input = colorPicker[0];
		const colorPicker_text = colorPicker[1];
		const colorPosition_range = colorPosition[0];
		const colorPosition_text = colorPosition[1];
		colContent.id = "cont-color" + newId;
		colorPicker_input.id = "input-color" + newId;
		colorPicker_text.id = "title-color" + newId;
		colorPosition_range.id = "pos-color" + newId;
		colorPosition_text.id = "dis-color" + newId;
	}

	// update the colorPreview
	const getColorPreview = colorPreview.style.background;
	const updatedColor = getColorPreview.replace(selStop, "");
	colorPreview.style.background = updatedColor;
	textHelper.innerHTML = updatedColor;
	setColor();
}

var degIndicator = document.querySelector("#indicator");
var degDisplayText = document.querySelector("#degValue");
degIndicator.style.transform = "rotate(" + degDisplayText.innerHTML + "deg)";

function decrementCurrentValue() {
	var currentValue = degDisplayText.innerHTML;
	var intCurrentValue = parseInt(currentValue);
	intCurrentValue = intCurrentValue - 45;
	if (intCurrentValue < 0) {
		intCurrentValue = 0;
	}
	degIndicator.style.transform = "rotate(" + intCurrentValue + "deg)";
	degDisplayText.innerHTML = intCurrentValue;
	var currentColor = colorPreview.style.background;
	var currentDeg = currentValue + "deg, ";
	var newGradColor = currentColor
		.replace("linear-gradient(", "linear-gradient(" + intCurrentValue + "deg, ")
		.replace(currentDeg, "");
	colorPreview.style.background = newGradColor;
	document.querySelector("#gText").innerHTML = newGradColor;
}

function incrementCurrentValue() {
	var currentValue = degDisplayText.innerHTML;
	var intCurrentValue = parseInt(currentValue);
	intCurrentValue = intCurrentValue + 45;
	if (intCurrentValue > 360) {
		intCurrentValue = 360;
	}
	degIndicator.style.transform = "rotate(" + intCurrentValue + "deg)";
	degDisplayText.innerHTML = intCurrentValue;
	var currentColor = colorPreview.style.background;
	var currentDeg = currentValue + "deg, ";
	var newGradDeg = "linear-gradient(" + intCurrentValue + "deg, ";
	var newGradColor = currentColor
		.replace("linear-gradient(", newGradDeg)
		.replace(currentDeg, "");
	colorPreview.style.background = newGradColor;
	document.querySelector("#gText").innerHTML = newGradColor;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
	modal.classList.remove("open");
	const ctabs = document.querySelectorAll(".tablinks");
	const conts = document.querySelectorAll(".colorTabContent");
	for (i = 0; i < ctabs.length; i++) {
		const ctab = ctabs[i];
		ctab.remove();
	}
	for (i = 0; i < conts.length; i++) {
		const cont = conts[i];
		cont.remove();
	}
	const colorModalTrigger = document.querySelector("#gTabId").innerHTML;
	const colorModalBtn = document.getElementById(colorModalTrigger);
	const colorModalProps = document.querySelector("#gText").innerHTML;
	const addtab = document.querySelector("#addColorTab");
	addtab.removeAttribute("style");
	degIndicator.style.transform = "rotate(180deg)";
	degDisplayText.innerHTML = "180";
	colorModalBtn.style.background = colorModalProps;
	document.querySelector("#text-helper").style.display = "none";
};

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
		modal.classList.remove("open");
		const ctabs = document.querySelectorAll(".tablinks");
		const conts = document.querySelectorAll(".colorTabContent");
		for (i = 0; i < ctabs.length; i++) {
			const ctab = ctabs[i];
			ctab.remove();
		}
		for (i = 0; i < conts.length; i++) {
			const cont = conts[i];
			cont.remove();
		}
		const colorModalTrigger = document.querySelector("#gTabId").innerHTML;
		const colorModalBtn = document.getElementById(colorModalTrigger);
		const colorModalProps = document.querySelector("#gText").innerHTML;
		const addtab = document.querySelector("#addColorTab");
		addtab.removeAttribute("style");
		degIndicator.style.transform = "rotate(180deg)";
		degDisplayText.innerHTML = "180";
		colorModalBtn.style.background = colorModalProps;
		document.querySelector("#text-helper").style.display = "none";
	}
};
