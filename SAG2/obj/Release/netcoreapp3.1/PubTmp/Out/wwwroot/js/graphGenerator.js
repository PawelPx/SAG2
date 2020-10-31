

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

var swordPommel;
var swordHandle;
var swordBlade;

var mass, gripReference, centerOfMass, leverReference, hiltNode, bladeNode, actionPoint1, pivotPoint1, actionPoint2, pivotPoint2, overallLength, style;
var comToHandlePivot1, comToHandlePivot2, comToBladePivot1, comToBladePivot2, comToCross, handleLength, j1, j2, c, widthOfOval, heightOfOval, angleOfCone, degrees;
var cuttingPotential;
var scaledGripReference, scaledLeverReference, scaledCenterOfMass, scaledOverallLength, scaledWidthOfOval, scaledHeightOfOval, scaledBladeNode, scaledHiltNode,
    scaledActionPoint1, scaledPivotPoint1, scaledActionPoint2, scaledPivotPoint2;

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

mass = parseFloat(inputMass.value) / 1000;
gripReference = parseFloat(inputGripReference.value) / 100;
centerOfMass = parseFloat(inputCenterOfMass.value) / 100;
leverReference = parseFloat(inputLeverReference.value) / 100;
hiltNode = parseFloat(inputHiltNode.value) / 100;
bladeNode = parseFloat(inputBladeNode.value) / 100;
actionPoint1 = parseFloat(inputActionPoint1.value) / 100;
pivotPoint1 = parseFloat(inputPivotPoint1.value) / 100;
actionPoint2 = parseFloat(inputActionPoint2.value) / 100;
pivotPoint2 = parseFloat(inputPivotPoint2.value) / 100;
overallLength = parseFloat(inputOverallLength.value) / 100;
style = inputStyle.value;

comToHandlePivot1 = countComToHandlePivot(actionPoint1);
comToBladePivot1 = countComToBladePivot(pivotPoint1);
comToHandlePivot2 = countComToHandlePivot(actionPoint2);
comToBladePivot2 = countComToBladePivot(pivotPoint2);
countComToCross();
countHandleLength();
j1 = countJ(comToHandlePivot1, comToBladePivot1);
j2 = countJ(comToHandlePivot2, comToBladePivot2);
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


inputMass.onchange = function () {
    mass = parseFloat(inputMass.value) / 1000;
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
}
inputGripReference.onchange = function () {
    gripReference = parseFloat(inputGripReference.value) / 100;
    countComToCross();
    countHandleLength();
    j1 = countJ(comToHandlePivot1, comToBladePivot1);
    j2 = countJ(comToHandlePivot2, comToBladePivot2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();

    scaleGripReference();

    redraw();
}
inputCenterOfMass.onchange = function () {
    centerOfMass = parseFloat(inputCenterOfMass.value) / 100;
    comToHandlePivot1 = countComToHandlePivot(actionPoint1);
    comToHandlePivot2 = countComToHandlePivot(actionPoint2);
    comToBladePivot1 = countComToBladePivot(pivotPoint1);
    comToBladePivot2 = countComToBladePivot(pivotPoint2);
    j1 = countJ(comToHandlePivot1, comToBladePivot1);
    j2 = countJ(comToHandlePivot2, comToBladePivot2);
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
}
inputLeverReference.onchange = function () {
    leverReference = parseFloat(inputLeverReference.value) / 100;
    countHandleLength();
    countAngleOfCone();
    countDegrees();

    scaleLeverReference();

    redraw();
}
inputHiltNode.onchange = function () {
    hiltNode = parseFloat(inputHiltNode.value) / 100;

    scaleHiltNode();

    redraw();
}
inputBladeNode.onchange = function () {
    bladeNode = parseFloat(inputBladeNode.value) / 100;
    countCuttingPotential();

    scaleBladeNode();

    redraw();
}
inputActionPoint1.onchange = function () {
    actionPoint1 = parseFloat(inputActionPoint1.value) / 100;
    comToHandlePivot1 = countComToHandlePivot(actionPoint1);
    j1 = countJ(comToHandlePivot1, comToBladePivot1);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scaleActionPoint1();
    scaleHeightOfOval();

    redraw();
}
inputPivotPoint1.onchange = function () {
    pivotPoint1 = parseFloat(inputPivotPoint1.value) / 100;
    comToBladePivot1 = countComToBladePivot(pivotPoint1);
    j1 = countJ(comToHandlePivot1, comToBladePivot1);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scalePivotPoint1();
    scaleHeightOfOval();

    redraw();
}
inputActionPoint2.onchange = function () {
    actionPoint2 = parseFloat(inputActionPoint2.value) / 100;
    comToHandlePivot2 = countComToHandlePivot(actionPoint2);
    j2 = countJ(comToHandlePivot2, comToBladePivot2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scaleActionPoint2();
    scaleHeightOfOval();

    redraw();
}
inputPivotPoint2.onchange = function () {
    pivotPoint2 = parseFloat(inputPivotPoint2.value) / 100;
    comToBladePivot2 = countComToBladePivot(pivotPoint2);
    j2 = countJ(comToHandlePivot2, comToBladePivot2);
    countHeightOfOval();
    countAngleOfCone();
    countDegrees();
    countMasses();
    countPoints();
    countCuttingPotential();

    scalePivotPoint2();
    scaleHeightOfOval();

    redraw();
}
inputOverallLength.onchange = function () {
    overallLength = parseFloat(inputOverallLength.value) / 100;
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


function countComToHandlePivot(actionPoint) {
    return centerOfMass - actionPoint;
}

function countComToBladePivot(pivotPoint) {
    return pivotPoint - centerOfMass;
}

function countComToCross() {
    comToCross = centerOfMass - gripReference;
}

function countHandleLength() {
    handleLength = gripReference - leverReference;
}

function countJ(comToHandlePivot, comToBladePivot) {
    return comToHandlePivot * comToBladePivot + Math.pow(comToCross, 2);
}

function countWidthOfOval() {
    widthOfOval = c / mass;
}

function countHeightOfOval() {
    heightOfOval = (countOneHeightOfOval(j1, comToHandlePivot1, comToBladePivot1) + countOneHeightOfOval(j2, comToHandlePivot2, comToBladePivot2)) / 2;
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
        var x = Math.pow(centerOfMass - lengths[i], 2);
        var mass1 = countMass(x, comToHandlePivot1, comToBladePivot1);
        var mass2 = countMass(x, comToHandlePivot2, comToBladePivot2);
        masses.push((mass1 + mass2) / 2);                                           // mass - ...   moze byc blad
    }
}

function countPoints() {
    points.splice(0, points.length);
    for (i = 0; i < lengths.length; i++) {
        points.push(new Point(lengths[i] * scale, canvas.height - masses[i] * 100));
    }
}

function countOneHeightOfOval(j, comToHandlePivot, comToBladePivot) {
    var heightOfOval = ((widthOfOval * j) / (comToHandlePivot * comToBladePivot));
    return heightOfOval;
}

function countOneAngleOfCone(j) {
    var angleOfCone = widthOfOval * handleLength / j;
    return angleOfCone;
}

function countMass(x, comToHandlePivot, comToBladePivot) {
    var y = mass - ((mass * x) / (comToHandlePivot * comToBladePivot + x));
    return y;
}

function countCuttingPotential() {
    var x = Math.pow(centerOfMass - bladeNode, 2);
    var mass1 = countMass(x, comToHandlePivot1, comToBladePivot1);
    var mass2 = countMass(x, comToHandlePivot2, comToBladePivot2);
    cuttingPotential = ((mass1 + mass2) / 2) / mass * 100;
}

function scaleAll() {
    scaledGripReference = gripReference * scale;
    scaledLeverReference = leverReference * scale;
    scaledCenterOfMass = centerOfMass * scale;
    scaledHiltNode = hiltNode * scale;
    scaledBladeNode = bladeNode * scale;
    scaledActionPoint1 = actionPoint1 * scale;
    scaledPivotPoint1 = pivotPoint1 * scale;
    scaledActionPoint2 = actionPoint2 * scale;
    scaledPivotPoint2 = pivotPoint2 * scale;
    scaledOverallLength = overallLength * scale;
    scaledWidthOfOval = widthOfOval * scale;
    scaledHeightOfOval = heightOfOval * scale;
}
function scaleGripReference() {
    scaledGripReference = gripReference * scale;
}
function scaleLeverReference() {
    scaledLeverReference = leverReference * scale;
}
function scaleCenterOfMass() {
    scaledCenterOfMass = centerOfMass * scale;
}
function scaleHiltNode() {
    scaledHiltNode = hiltNode * scale;
}
function scaleBladeNode() {
    scaledBladeNode = bladeNode * scale;
}
function scaleActionPoint1() {
    scaledActionPoint1 = actionPoint1 * scale;
}
function scalePivotPoint1() {
    scaledPivotPoint1 = pivotPoint1 * scale;
}
function scaleActionPoint2() {
    scaledActionPoint2 = actionPoint2 * scale;
}
function scalePivotPoint2() {
    scaledPivotPoint2 = pivotPoint2 * scale;
}
function scaleOverallLength() {
    scaledOverallLength = overallLength * scale;
}
function scaleWidthOfOval() {
    scaledWidthOfOval = widthOfOval * scale;
}
function scaleHeightOfOval() {
    scaledHeightOfOval = heightOfOval * scale;
}



function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawOval();
    drawCones();
    drawChart();

    setTimeout(function () {
        if (style == "(none)") {
            drawSword();
        }
        else {
            swordPommel = document.getElementById(style + "Pommel");
            swordHandle = document.getElementById(style + "Handle");
            swordBlade = document.getElementById(style + "Blade");

            ctx.drawImage(swordPommel, 0, (canvas.height - scaledGripReference) / 2, scaledLeverReference, scaledGripReference);
            ctx.drawImage(swordHandle, scaledLeverReference, (canvas.height - scaledGripReference) / 2, scaledGripReference - scaledLeverReference, scaledGripReference);
            ctx.drawImage(swordBlade, scaledGripReference, (canvas.height - scaledGripReference) / 2, scaledOverallLength - scaledGripReference, scaledGripReference);
        }
        drawPoints();
    }, 1);

    labelCuttingPotential.innerHTML = cuttingPotential.toFixed(2);
    var x = widthOfOval * 100;
    labelInertiaX.innerHTML = x.toFixed(2);
    x = heightOfOval * 100;
    labelInertiaY.innerHTML = x.toFixed(2);
    labelManeuverability.innerHTML = degrees.toFixed(2);
}

function drawOval() {
    ctx.fillStyle = "#eeeeff";
    ctx.strokeStyle = "#0f75bc";

    ctx.beginPath();
    ctx.ellipse(scaledGripReference, (canvas.height) / 2, scaledWidthOfOval / 2, scaledHeightOfOval / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
}

function drawCones() {
    drawPieSlice(scaledGripReference, canvas.height / 2, scaledOverallLength - scaledGripReference, -angleOfCone, -angleOfCone + Math.PI / 90 * degrees);
    drawPieSlice(scaledGripReference, canvas.height / 2, scaledGripReference, Math.PI - angleOfCone, Math.PI - angleOfCone + Math.PI / 90 * degrees);

    ctx.beginPath();
    ctx.ellipse(scaledGripReference, (canvas.height) / 2, scaledWidthOfOval / 2, scaledHeightOfOval / 2, 0, 0, 2 * Math.PI);
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

function drawPoints() {
    ctx.setLineDash([10, 10]);
    drawLine(scaledBladeNode, canvas.height / 2, scaledBladeNode, canvas.height);
    drawLine(scaledHiltNode, canvas.height / 2, scaledHiltNode, canvas.height);

    ctx.setLineDash([]);
    ctx.strokeStyle = "#000000";
    drawLine(scaledCenterOfMass, canvas.height / 2 - 20, scaledCenterOfMass, canvas.height);

    ctx.strokeStyle = "#00ff00";
    drawLine(scaledActionPoint2, canvas.height / 2 - 20, scaledActionPoint2, canvas.height / 2 + 20);
    drawLine(scaledPivotPoint2, canvas.height / 2 - 20, scaledPivotPoint2, canvas.height / 2 + 20);

    ctx.strokeStyle = "#ff0000";
    drawLine(scaledActionPoint1, canvas.height / 2 - 20, scaledActionPoint1, canvas.height / 2 + 20);
    drawLine(scaledPivotPoint1, canvas.height / 2 - 20, scaledPivotPoint1, canvas.height / 2 + 20);

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

function drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function download() {
    var link = document.createElement('a');
    link.download = 'graph.png';
    link.href = canvas.toDataURL();
    link.click();
}
