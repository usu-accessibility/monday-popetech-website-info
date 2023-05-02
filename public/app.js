const syncBtn = document.getElementById("startSync");
const card = document.getElementById("card");
const list = document.getElementById("list");

syncBtn.addEventListener("click", async () => {
  syncBtn.classList.add("disabled");
  syncBtn.innerHTML = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
  list.innerHTML = "";
  card.classList.add("visually-hidden");
  try {
    const response = await axios.get("/sync");
    console.log(response.data);
    if (response.data.length > 0) {
      for (link of response.data) {
        let div = document.createElement("p");
        div.innerHTML = link;
        div.classList.add("text-break");
        list.appendChild(div);
      }
    } else {
      let div = document.createElement("p");
      div.innerHTML = "No Links found";
      list.appendChild(div);
    }
    card.classList.remove("visually-hidden");
  } catch (err) {
    console.error(err);
  } finally {
    syncBtn.classList.remove("disabled");
    syncBtn.innerHTML = "Start Sync";
  }
});
