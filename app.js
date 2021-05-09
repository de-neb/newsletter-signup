const express = require("express");
const { urlencoded } = require("body-parser");
const path = require("path");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const api = require("./config");

app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//set up mailchimp
mailchimp.setConfig({
  apiKey: api.mailChimpKey,
  server: "us1",
});

app.post("/", (req, res) => {
  //required info that we want to add in mailchimp's audience/subscriber's info
  const listId = "afaffed7cb";
  const firstName = req.body["first-name"];
  const lastName = req.body["last-name"];
  const email = req.body.email;

  const run = async () => {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log("something went wrong");
      console.log("status code", error.status);
      console.log("text", error.response.text);
      const objRes = JSON.parse(error.response.text);
      res.render("failure", {
        errorDetail: objRes.detail,
      });
    }
  };
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server runs in port 3000");
});
