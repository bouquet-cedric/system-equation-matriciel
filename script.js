var container;
var k = 3;
var show_logs = false;

class Fraction {
  static fromDecimal = (dec) => {
    let isNeg = dec < 0;
    if (isNeg) dec = -1 * dec;
    let result = [...Array(1000).keys()]
      .flatMap((i) =>
        [...Array(1000).keys()].map((j) => [
          i + 1,
          j + 1,
          (i + 1) / (j + 1),
          Math.abs((i + 1) / (j + 1) - dec),
        ])
      )
      .sort((a, b) => a[3] - b[3])[0]
      .slice(0, 2);
    if (isNeg) {
      result[0] *= -1;
    }
    return result;
  };
}

function log(...params) {
  if (show_logs) console.log(...params);
}

function transpose(matrix) {
  var size = matrix[0].length;
  var copie = Object.assign({}, matrix);
  var dones = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      var duo = i + "-" + j;
      var duo2 = j + "-" + i;
      if (!(dones.includes(duo) || dones.includes(duo2))) {
        var tmp = copie[i][j];
        copie[i][j] = copie[j][i];
        copie[j][i] = tmp;
        dones.push(duo);
      }
    }
  }
  return copie;
}

function adjacentMatrix(matrix) {
  let size = matrix[0].length;
  if (size == 3) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[0][2];
    var d = matrix[1][0];
    var e = matrix[1][1];
    var f = matrix[1][2];
    var g = matrix[2][0];
    var h = matrix[2][1];
    var i = matrix[2][2];
    return [
      [
        det([
          [e, f],
          [h, i],
        ]),
        -1 *
          det([
            [d, f],
            [g, i],
          ]),
        det([
          [d, e],
          [g, h],
        ]),
      ],
      [
        -1 *
          det([
            [b, c],
            [h, i],
          ]),
        det([
          [a, c],
          [g, i],
        ]),
        -1 *
          det([
            [a, b],
            [g, h],
          ]),
      ],
      [
        det([
          [b, c],
          [e, f],
        ]),
        -1 *
          det([
            [a, c],
            [d, f],
          ]),
        det([
          [a, b],
          [d, e],
        ]),
      ],
    ];
  }
}

function inverseMatrix(matrix) {
  let d = det(matrix);
  if (d == 0)
    return new Error(
      "Erreur : La matrice n'est pas inversible.<br/>Le déterminant est égal à 0, donc il n'y a pas de solution unique."
    );
  At = transpose(matrix);
  let Aadj = adjacentMatrix(At);
  return Aadj.map((t) => t.map((value) => value / d));
}

function det(matrix) {
  var size = matrix[0].length;
  if (size == 2) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[1][0];
    var d = matrix[1][1];
    return a * d - b * c;
  }
  if (size == 3) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[0][2];
    var d = matrix[1][0];
    var e = matrix[1][1];
    var f = matrix[1][2];
    var g = matrix[2][0];
    var h = matrix[2][1];
    var i = matrix[2][2];
    log(`
determinant
=  ${a} x ${e} x ${i} + ${c} x ${d} x ${h} + ${b} x ${f} x ${g}
 - ${g} x ${e} x ${c} - ${d} x ${b} x ${i} - ${a} x ${f} x ${h}
=  ${a * e * i} + ${c * d * h} + ${b * f * g}
 - ${g * e * c} - ${d * b * i} - ${a * f * h}
=  ${a * e * i + c * d * h + b * f * g} - ${g * e * c + d * b * i + a * f * h}
    `);
    return (
      a * e * i + c * d * h + b * f * g - g * e * c - d * b * i - a * f * h
    );
  }
}

function getMatrices() {
  var matrixA = [];
  var matrixB = [];
  for (let i = 1; i <= k; i++) {
    var rowA = [];
    var rowB = [];
    for (let j = 0; j <= k; j++) {
      var value = parseInt(
        document.getElementById("case_" + i + "_" + j).textContent
      );
      if (j < k) rowA.push(isNaN(value) ? 0 : value);
      else rowB.push(isNaN(value) ? 0 : value);
    }
    matrixA.push(rowA);
    matrixB.push(rowB);
  }
  return [matrixA, matrixB];
}

function multiplieMatrix(matrix1, matrix2) {
  var size = matrix1[0].length;
  var size2 = matrix2[0].length;
  if (size == 3 && size2 == 1) {
    var a = matrix1[0][0];
    var b = matrix1[0][1];
    var c = matrix1[0][2];
    var d = matrix1[1][0];
    var e = matrix1[1][1];
    var f = matrix1[1][2];
    var g = matrix1[2][0];
    var h = matrix1[2][1];
    var i = matrix1[2][2];
    var x = matrix2[0];
    var y = matrix2[1];
    var z = matrix2[2];
    return [
      [Fraction.fromDecimal(a * x + b * y + c * z)],
      [Fraction.fromDecimal(d * x + e * y + f * z)],
      [Fraction.fromDecimal(g * x + h * y + i * z)],
    ];
  }
}

function reset() {
  for (let i = 1; i <= k; i++) {
    for (let j = 0; j <= k; j++) {
      document.getElementById("case_" + i + "_" + j).textContent = "";
    }
  }
}

function init() {
  var table = document.createElement("table");
  var middle = document.createElement("div");
  middle.classList.add("middle");
  container.appendChild(middle);
  var start = 0;
  middle.appendChild(table);
  var ths = ["x", "y", "z", "total"];
  var data = [5, 3, 9, 48, 2, -4, 2, 23, 1, 9, 6, 43];
  for (let i = 0; i <= k; i++) {
    var tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j <= k; j++) {
      var elem = i == 0 ? "th" : "td";
      var classe = i == 0 ? "header" : "column";
      var el = document.createElement(elem);
      el.id = "case_" + i + "_" + j;
      el.classList.add(classe + "_" + (j + 1));
      el.contentEditable = i == 0 ? false : true;
      el.textContent = i == 0 ? ths[j] : data[start];
      if (i != 0) start++;
      tr.appendChild(el);
    }
  }
  var buttonCalcul = document.createElement("input");
  buttonCalcul.type = "button";
  buttonCalcul.value = "Résoudre le système";
  var buttonReset = document.createElement("input");
  buttonReset.type = "button";
  buttonReset.value = "Réinitialiser les données";
  buttonReset.addEventListener("click", reset);
  var result = document.createElement("div");
  var spanResult = document.createElement("h5");
  spanResult.textContent = "Résultat :";
  var pRes = document.createElement("p");
  middle.appendChild(result);
  result.classList.add("result");
  result.appendChild(spanResult);
  result.appendChild(pRes);
  result.style.display = "none";
  buttonCalcul.addEventListener("click", function () {
    var mat = getMatrices();
    var A = mat[0];
    var B = mat[1];
    var Ainv = inverseMatrix(A);
    result.style.display = "initial";
    if (Ainv instanceof Error) {
      pRes.innerHTML = Ainv.message;
    } else {
      var res = multiplieMatrix(Ainv, B);
      pRes.innerHTML = `
      <span class='text-result'>x = <sup>${res[0][0][0]}</sup>&frasl;<sub>${res[0][0][1]}</sub></span>
      <span class='text-result'>y = <sup>${res[1][0][0]}</sup>&frasl;<sub>${res[1][0][1]}</sub></span>
      <span class='text-result'>z = <sup>${res[2][0][0]}</sup>&frasl;<sub>${res[2][0][1]}</sub></span>`;
    }
  });
  var buttons = document.createElement("div")
  buttons.classList.add("buttons")
  container.appendChild(buttons);
  buttons.appendChild(buttonCalcul);
  buttons.appendChild(buttonReset);
}

window.onload = function () {
  container = document.getElementById("container");
  init();
};
