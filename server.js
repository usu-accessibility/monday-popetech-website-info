require("dotenv").config();

const express = require("express");
const path = require("path");
const axios = require("axios").default;
const mondaySdk = require("monday-sdk-js");

const app = express();
const monday = mondaySdk();

monday.setToken(process.env.monday_key);

app.use(express.static(path.join(__dirname, "public")));

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.get("/sync", async (req, res) => {
  let done = false;
  let link = "https://api.pope.tech/organizations/usu/websites?limit=250";
  let popeWebsiteData = [];
  let mondayWebsiteData = [];
  let unusedWebsitesData = [];
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
    const response = await monday.api(`query {
      boards(ids: [2929644510]) {
        groups(ids: ["1668548676_usu_websites___cano"]) {
          items {
            column_values(ids: ["text4"]) {
              text
            }
          }
        }
      }
    }`);
    for (let item of response.data.boards[0].groups[0].items) {
      const link = item.column_values[0].text;
      mondayWebsiteData.push(link);
    }
  } catch (err) {
    console.error(err);
  }

  try {
    const response = await monday.api(`query {
      boards(ids: [2929644510]) {
        groups(ids: ["new_group68585"]) {
          items {
            column_values(ids: ["text4"]) {
              text
            }
          }
        }
      }
    }`);
    for (let item of response.data.boards[0].groups[0].items) {
      const link = item.column_values[0].text;
      unusedWebsitesData.push(link);
    }
    for (let link of unusedWebsitesData) {
      const removed = popeWebsiteData.filter((item) => !link.startsWith(item));

      popeWebsiteData = removed;
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

module.exports = app;
