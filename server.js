require("dotenv").config();

const path = require("path");
const express = require("express");
const axios = require("axios").default;
const mondaySdk = require("monday-sdk-js");

const app = express();
const monday = mondaySdk();

monday.setToken(process.env.monday_key);

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.get("/sync", async (req, res) => {
  let done = false;
  let link = "https://api.pope.tech/organizations/usu/websites?limit=250";
  let popeWebsiteData = [];
  let mondayWebsiteData = [];
  while (!done) {
    try {
      const response = await axios.get(link, {
        headers: {
          Authorization: `Bearer ${process.env.pope_tech_key}`,
        },
      });
      for (let item of response.data.data) {
        const link = item.full_url;
        popeWebsiteData.push(link);
      }

      const pagData = response.data.meta.pagination;

      if (pagData.current_page === pagData.last_page) {
        done = true;
      }
      link = pagData.links.next + "&limit=250";
    } catch (err) {
      console.error(err);
    }
  }
  try {
    const response = await monday.api(`{
      boards(ids: [2929644510]) {
        groups(
          ids: ["1668548676_usu_websites___cano", "new_group67768", "new_group90586", "new_group23495"]
        ) {
          items_page(limit: 500) {
            items {
              column_values(ids: ["text4"]) {
                text
              }
            }
          }
        }
      }
    }`);

    for (let group of response.data.boards[0].groups) {
      for (let item of group.items_page.items) {
        mondayWebsiteData.push(item.column_values[0].text);
      }
    }
  } catch (err) {
    console.error(err);
  }

  let errors = [];
  for (link of popeWebsiteData) {
    const exists = mondayWebsiteData.find((element) =>
      element.startsWith(link)
    );
    if (!exists) {
      errors.push(link);
    }
  }

  res.json(errors);
});

app.use("*", (req, res) => {
  res.redirect("/");
});

module.exports = app;
