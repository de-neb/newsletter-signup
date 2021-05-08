const express = require("express");
const { urlencoded } = require("body-parser");
const path = require("path");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//set up mailchimp
mailchimp.setConfig({
  apiKey: "e9271ee99ae2d0047247b987bb20d1f2-us1",
  server: "us1",
});

app.post("/", (req, res) => {
  //required info that we want to add in mailchimp's audience/subscriber's info
  const listId = "afaffed7cb";
  const firstName = req.body["first-name"];
  const lastName = req.body["last-name"];
  const email = req.body.email;

  try {
    mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    });
    res.sendFile(__dirname + "/success.html");
  } catch (error) {
    res.sendFile(__dirname + "/failure.html");
    console.log(error.statusCode);
  }
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server runs in port 3000");
});

// api key mailchimp
// e9271ee99ae2d0047247b987bb20d1f2-us1

// list id
// afaffed7cb
