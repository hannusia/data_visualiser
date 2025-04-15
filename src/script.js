const fileInput = document.getElementById("fileInput");
const loadBtn = document.getElementById("loadBtn");
const tablePreview = document.getElementById("tablePreview");
const previewSection = document.getElementById("previewSection");
const chartSection = document.getElementById("chartSection");

let chart; // Chart.js instance

loadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file!");
    return;
  }

  if (file.name.endsWith(".csv")) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        showPreview(results.data);
        drawChart(results.data);
      },
    });
  } else {
    alert("Only CSV files are supported for now.");
  }
});

function showPreview(data) {
  if (!data.length) return;

  let table = "<table><thead><tr>";
  Object.keys(data[0]).forEach(key => {
    table += `<th>${key}</th>`;
  });
  table += "</tr></thead><tbody>";

  data.slice(0, 10).forEach(row => {
    table += "<tr>";
    Object.values(row).forEach(value => {
      table += `<td>${value}</td>`;
    });
    table += "</tr>";
  });

  table += "</tbody></table>";

  tablePreview.innerHTML = table;
  previewSection.classList.remove("hidden");
}

function drawChart(data) {
  const keys = Object.keys(data[0]);
  const labels = data.map(row => row[keys[0]]);
  const values = data.map(row => row[keys[1]]);

  const ctx = document.getElementById("chartCanvas").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: keys[1],
        data: values,
        backgroundColor: "#3399ff",
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  chartSection.classList.remove("hidden");
}
