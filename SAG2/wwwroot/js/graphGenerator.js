

var canvas = document.getElementById("graph");
canvas.width = 1000;
canvas.height = 700;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var ctx = canvas.getContext("2d");

var imageOfPommel;
var imageOfHandle;
var imageOfBlade;

var mass, gripReference, centerOfMass, leverReference, hiltNode, bladeNode, actionPoint1, pivotPoint1, actionPoint2, pivotPoint2, overallLength, style;
var comToActionPoint1, comToActionPoint2, comToPivotPoint1, comToPivotPoint2, comToCross, comToHandle, j1, j2, c, widthOfOval, heightOfOval, angleOfCone, degrees;
var cuttingPotential;
var scaledGripReference, scaledLeverReference, scaledCenterOfMass, scaledOverallLength, scaledWidthOfOval, scaledHeightOfOval, scaledBladeNode, scaledHiltNode,
    scaledActionPoint1, scaledPivotPoint1, scaledActionPoint2, scaledPivotPoint2;
var heightOfSword = 120;
var lengthOfLine = 20;

c = 0.2;
var scale = 500;
var lengths = [];
var masses = [];
var points = [];

var inputMass = document.getElementById("Sword_Mass");
var inputGripReference = document.getElementById("Sword_GripReference");
var inputCenterOfMass = document.getElementById("Sword_CenterOfMass");
var inputLeverReference = document.getElementById("Sword_LeverReference");
var inputHiltNode = document.getElementById("Sword_HiltNode");
var inputBladeNode = document.getElementById("Sword_BladeNode");
var inputActionPoint1 = document.getElementById("Sword_ActionPoint1");
var inputPivotPoint1 = document.getElementById("Sword_PivotPoint1");
var inputActionPoint2 = document.getElementById("Sword_ActionPoint2");
var inputPivotPoint2 = document.getElementById("Sword_PivotPoint2");
var inputOverallLength = document.getElementById("Sword_OverallLength");
var inputStyle = document.getElementById("Sword_Style");

var labelCuttingPotential = document.getElementById("cuttingPotential");
var labelInertiaX = document.getElementById("inertiaX");
var labelInertiaY = document.getElementById("inertiaY");
var labelManeuverability = document.getElementById("maneuverability");

mass = scaleInput(inputMass, 1000);
gripReference = scaleInput(inputGripReference);
centerOfMass = scaleInput(inputCenterOfMass);
leverReference = scaleInput(inputLeverReference);
hiltNode = scaleInput(inputHiltNode);
bladeNode = scaleInput(inputBladeNode);
actionPoint1 = scaleInput(inputActionPoint1);
pivotPoint1 = scaleInput(inputPivotPoint1);
actionPoint2 = scaleInput(inputActionPoint2);
pivotPoint2 = scaleInput(inputPivotPoint2);
overallLength = scaleInput(inputOverallLength);
style = inputStyle.value;

comToActionPoint1 = countComToActionPoint(actionPoint1);
comToPivotPoint1 = countComToPivotPoint(pivotPoint1);
comToActionPoint2 = countComToActionPoint(actionPoint2);
comToPivotPoint2 = countComToPivotPoint(pivotPoint2);
countComToCross();
countComToHandle();
j1 = countJ(comToActionPoint1, comToPivotPoint1);
j2 = countJ(comToActionPoint2, comToPivotPoint2);
countWidthOfOval();
countHeightOfOval();
countAngleOfCone();
countDegrees();
countLengths();
countMasses();
countPoints();
countCuttingPotential();
scaleAll();

redraw();
resetAttributes();


inputMass.onchange = function () {
    mass = scaleInput(inputMass, 1000);

    countWidthOfOval()
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scaleWidthOfOval();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputGripReference.onchange = function () {
    gripReference = scaleInput(inputGripReference);

    countComToCross();
    j1 = countJ(comToActionPoint1, comToPivotPoint1);
    j2 = countJ(comToActionPoint2, comToPivotPoint2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();

    scaleGripReference();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputCenterOfMass.onchange = function () {
    centerOfMass = scaleInput(inputCenterOfMass);

    comToActionPoint1 = countComToActionPoint(actionPoint1);
    comToActionPoint2 = countComToActionPoint(actionPoint2);
    comToPivotPoint1 = countComToPivotPoint(pivotPoint1);
    comToPivotPoint2 = countComToPivotPoint(pivotPoint2);
    countComToCross();
    countComToHandle();
    j1 = countJ(comToActionPoint1, comToPivotPoint1);
    j2 = countJ(comToActionPoint2, comToPivotPoint2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countLengths();
    countMasses();
    countPoints();
    countCuttingPotential();

    scaleCenterOfMass();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputLeverReference.onchange = function () {
    leverReference = scaleInput(inputLeverReference);

    countComToHandle();
    countAngleOfCone();
    countDegrees();

    scaleLeverReference();

    redraw();
    resetAttributes();
}
inputHiltNode.onchange = function () {
    hiltNode = scaleInput(inputHiltNode);

    scaleHiltNode();

    redraw();
}
inputBladeNode.onchange = function () {
    bladeNode = scaleInput(inputBladeNode);

    countCuttingPotential();

    scaleBladeNode();

    redraw();
    resetAttributes();
}
inputActionPoint1.onchange = function () {
    actionPoint1 = scaleInput(inputActionPoint1);

    comToActionPoint1 = countComToActionPoint(actionPoint1);
    j1 = countJ(comToActionPoint1, comToPivotPoint1);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scaleActionPoint1();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputPivotPoint1.onchange = function () {
    pivotPoint1 = scaleInput(inputPivotPoint1);

    comToPivotPoint1 = countComToPivotPoint(pivotPoint1);
    j1 = countJ(comToActionPoint1, comToPivotPoint1);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scalePivotPoint1();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputActionPoint2.onchange = function () {
    actionPoint2 = scaleInput(inputActionPoint2);

    comToActionPoint2 = countComToActionPoint(actionPoint2);
    j2 = countJ(comToActionPoint2, comToPivotPoint2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scaleActionPoint2();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputPivotPoint2.onchange = function () {
    pivotPoint2 = scaleInput(inputPivotPoint2);

    comToPivotPoint2 = countComToPivotPoint(pivotPoint2);
    j2 = countJ(comToActionPoint2, comToPivotPoint2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scalePivotPoint2();
    scaleHeightOfOval();

    redraw();
    resetAttributes();
}
inputOverallLength.onchange = function () {
    overallLength = scaleInput(inputOverallLength);

    countLengths();
    countMasses();
    countPoints();

    scaleOverallLength();

    redraw();
}
inputStyle.onchange = function () {
    style = inputStyle.value;
    redraw();
}


function countComToActionPoint(actionPoint) {
    return centerOfMass - actionPoint;
}

function countComToPivotPoint(pivotPoint) {
    return pivotPoint - centerOfMass;
}

function countComToCross() {
    comToCross = centerOfMass - gripReference;
}

function countComToHandle() {
    comToHandle = centerOfMass - leverReference;
}

function countJ(comToActionPoint, comToPivotPoint) {
    return comToActionPoint * comToPivotPoint + Math.pow(comToCross, 2);
}

function countWidthOfOval() {
    widthOfOval = c / mass;
}

function countHeightOfOval() {
    heightOfOval = (countOneHeightOfOval(j1, comToActionPoint1, comToPivotPoint1) + countOneHeightOfOval(j2, comToActionPoint2, comToPivotPoint2)) / 2;
}

function countAngleOfCone() {
    angleOfCone = (countOneAngleOfCone(j1) + countOneAngleOfCone(j2)) / 2;
}

function countDegrees() {
    degrees = angleOfCone * 180 / Math.PI;
}

function countLengths() {
    lengths.splice(0, lengths.length);
    for (i = 0; i < centerOfMass; i = i + 0.05) {
        lengths.push(i);
    }
    for (i = centerOfMass; i < overallLength; i = i + 0.05) {
        lengths.push(i);
    }
    lengths.push(overallLength);
}

function countMasses() {
    masses.splice(0, masses.length);
    for (i = 0; i < lengths.length; i++) {
        var distanceToCom = Math.pow(centerOfMass - lengths[i], 2);
        var mass1 = countMass(distanceToCom, comToActionPoint1, comToPivotPoint1);
        var mass2 = countMass(distanceToCom, comToActionPoint2, comToPivotPoint2);
        masses.push((mass1 + mass2) / 2);
    }
}
function countMass(distanceToCom, comToActionPoint, comToPivotPoint) {
    var y = mass - ((mass * distanceToCom) / (comToActionPoint * comToPivotPoint + distanceToCom));
    return y;
}

function countPoints() {
    points.splice(0, points.length);
    for (i = 0; i < lengths.length; i++) {
        points.push(new Point(lengths[i] * scale, canvas.height - masses[i] * 100));
    }
}

function countOneHeightOfOval(j, comToActionPoint, comToPivotPoint) {
    var heightOfOval = ((widthOfOval * j) / (comToActionPoint * comToPivotPoint));
    return heightOfOval;
}

function countOneAngleOfCone(j) {
    var angleOfCone = widthOfOval * comToHandle / j;
    return angleOfCone;
}

function countCuttingPotential() {
    var x = Math.pow(centerOfMass - bladeNode, 2);
    var mass1 = countMass(x, comToActionPoint1, comToPivotPoint1);
    var mass2 = countMass(x, comToActionPoint2, comToPivotPoint2);
    cuttingPotential = ((mass1 + mass2) / 2) / mass * 100;
}

function scaleInput(input, scale = 100) {
    return parseFloat(input.value) / scale;
}
function scaleAll() {
    scaleGripReference();
    scaleLeverReference();
    scaleCenterOfMass();
    scaleHiltNode();
    scaleBladeNode();
    scaleActionPoint1();
    scalePivotPoint1();
    scaleActionPoint2();
    scalePivotPoint2();
    scaleOverallLength();
    scaleWidthOfOval();
    scaleHeightOfOval();
}
function scaleGripReference() {
    scaledGripReference = scaleOutput(gripReference);
}
function scaleLeverReference() {
    scaledLeverReference = scaleOutput(leverReference);
}
function scaleCenterOfMass() {
    scaledCenterOfMass = scaleOutput(centerOfMass);
}
function scaleHiltNode() {
    scaledHiltNode = scaleOutput(hiltNode);
}
function scaleBladeNode() {
    scaledBladeNode = scaleOutput(bladeNode);
}
function scaleActionPoint1() {
    scaledActionPoint1 = scaleOutput(actionPoint1);
}
function scalePivotPoint1() {
    scaledPivotPoint1 = scaleOutput(pivotPoint1);
}
function scaleActionPoint2() {
    scaledActionPoint2 = scaleOutput(actionPoint2);
}
function scalePivotPoint2() {
    scaledPivotPoint2 = scaleOutput(pivotPoint2);
}
function scaleOverallLength() {
    scaledOverallLength = scaleOutput(overallLength);
}
function scaleWidthOfOval() {
    scaledWidthOfOval = scaleOutput(widthOfOval);
}
function scaleHeightOfOval() {
    scaledHeightOfOval = scaleOutput(heightOfOval);
}
function scaleOutput(value) {
    return value * scale;
}


function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#eeeeff";
    ctx.strokeStyle = "#0f75bc";

    drawOval();
    drawCones();
    drawChart();

    setTimeout(function () {
        if (style == "(none)") {
            drawSword();
        }
        else {
            imageOfPommel = document.getElementById(style + "Pommel");
            imageOfHandle = document.getElementById(style + "Handle");
            imageOfBlade = document.getElementById(style + "Blade");

            drawSwordWithImages();
        }
        drawPoints();
    }, 1);
}

function resetAttributes() {
    labelCuttingPotential.innerHTML = cuttingPotential.toFixed(2);
    labelInertiaX.innerHTML = convertInertia(widthOfOval);
    labelInertiaY.innerHTML = convertInertia(heightOfOval);
    labelManeuverability.innerHTML = degrees.toFixed(2);
}
function convertInertia(value) {
    return (value * 100).toFixed(2);
}

function drawOval() {
    ctx.beginPath();
    drawEllipse();
    ctx.fill();
}

function drawEllipse() {
    ctx.ellipse(scaledGripReference, canvas.height / 2, scaledWidthOfOval / 2, scaledHeightOfOval / 2, 0, 0, 2 * Math.PI);
}

function drawCones() {
    drawCircleSlice(scaledGripReference, canvas.height / 2, scaledOverallLength - scaledGripReference, -angleOfCone, -angleOfCone + Math.PI / 90 * degrees);
    drawCircleSlice(scaledGripReference, canvas.height / 2, scaledGripReference, Math.PI - angleOfCone, Math.PI - angleOfCone + Math.PI / 90 * degrees);

    ctx.beginPath();
    drawEllipse();
    ctx.stroke();
}

function drawCircleSlice(centerX, centerY, radius, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawChart() {
    ctx.beginPath();
    // move to the first point
    ctx.moveTo(points[0].x, points[0].y);

    for (i = 1; i < points.length - 2; i++) {
        var xc = (points[i].x + points[i + 1].x) / 2;
        var yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // curve through the last two points
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

    // bottom part
    ctx.lineTo(points[i + 1].x, canvas.height - 1);
    ctx.lineTo(1, canvas.height - 1);
    ctx.lineTo(1, points[0].y);

    ctx.stroke();
    ctx.fill();
}

function drawSword() {
    ctx.fillStyle = "#0f75bc";

    ctx.fillRect(0, canvas.height / 2 - 3, scaledGripReference, 6);
    ctx.fillRect(scaledGripReference, (canvas.height - scaledGripReference) / 2, 6, scaledGripReference);
    ctx.fillRect(scaledGripReference, canvas.height / 2 - 3, scaledOverallLength - scaledGripReference, 6);
}

function drawSwordWithImages() {
    ctx.drawImage(imageOfPommel, 0, (canvas.height - heightOfSword) / 2, scaledLeverReference, heightOfSword);
    ctx.drawImage(imageOfHandle, scaledLeverReference, (canvas.height - heightOfSword) / 2, scaledGripReference - scaledLeverReference, heightOfSword);
    ctx.drawImage(imageOfBlade, scaledGripReference, (canvas.height - heightOfSword) / 2, scaledOverallLength - scaledGripReference, heightOfSword);
}

function drawPoints() {
    ctx.setLineDash([10, 10]);
    drawLine(scaledBladeNode, canvas.height / 2, scaledBladeNode, canvas.height);
    drawLine(scaledHiltNode, canvas.height / 2, scaledHiltNode, canvas.height);

    ctx.setLineDash([]);
    ctx.strokeStyle = "#000000";
    drawLine(scaledCenterOfMass, canvas.height / 2 - lengthOfLine, scaledCenterOfMass, canvas.height);

    ctx.strokeStyle = "#00ff00";
    drawLine(scaledActionPoint2, canvas.height / 2 - lengthOfLine, scaledActionPoint2, canvas.height / 2 + lengthOfLine);
    drawLine(scaledPivotPoint2, canvas.height / 2 - lengthOfLine, scaledPivotPoint2, canvas.height / 2 + lengthOfLine);

    ctx.strokeStyle = "#ff0000";
    drawLine(scaledActionPoint1, canvas.height / 2 - lengthOfLine, scaledActionPoint1, canvas.height / 2 + lengthOfLine);
    drawLine(scaledPivotPoint1, canvas.height / 2 - lengthOfLine, scaledPivotPoint1, canvas.height / 2 + lengthOfLine);

    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.fillText(cuttingPotential.toFixed(2) + "%", scaledBladeNode + 5, canvas.height - 5);
}


function drawLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function download() {
    var link = document.createElement('a');
    link.download = 'graph.png';
    link.href = canvas.toDataURL();
    link.click();
}
