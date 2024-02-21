const syncBtn = document.getElementById("startSync");
const total = document.getElementById("total");
const list = document.getElementById("list");

function handleCopy(element) {
  navigator.clipboard.writeText(element.getAttribute("link"));
  element.setAttribute("data-tooltip", "Copied!");
}

syncBtn.addEventListener("click", async () => {
  syncBtn.ariaBusy = "true";
  syncBtn.textContent = "Loading...";
  list.innerHTML = "";
  total.innerHTML = "";
  try {
    const response = await axios.get("/sync");
    if (response.data.length > 0) {
      let table = document.createElement("table");
      table.role = "grid";
      table.innerHTML = `
        <thead>
          <tr>
            <th scope="col"><strong>#</strong></th>
            <th scope="col"><strong>Url</strong></th>
            <th scope="col"></th>
          </tr>
        </thead>
      `;
      let tbody = document.createElement("tbody");
      response.data.forEach((link, idx) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
          <th scope="row">${idx + 1}</th>
          <td><a href="${link}" target="_blank" >${link}</a></td>
          <td><button onclick="handleCopy(this)" role="button" class="secondary outline" link="${link}" data-toolip="Click to copy" >Copy</button></td>
        `;
        tbody.appendChild(tr);
      });
      total.innerHTML = `<strong>Total:</strong> ${response.data.length}`;
      table.appendChild(tbody);
      list.appendChild(table);
    } else {
      list.innerHTML = "<p>No links found.</p>";
    }
  } catch (err) {
    console.error(err);
    list.innerHTML =
      "<p>Something went wrong. Please check console and try again.</p>";
  } finally {
    syncBtn.ariaBusy = "false";
    syncBtn.textContent = "Start Sync";
  }
});
