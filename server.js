const fs = require("fs");
const http = require("http");
const { createDateString } = require("./util");
require("dotenv").config();

let users = [
  {
    id: 1,
    name: "Win",
    email: "win@gmail.com",
    password: "hey",
    createdAt: createDateString(),
    updatedAt: createDateString(),
  },
  {
    id: 2,
    name: "min",
    email: "min@gmail.com",
    password: "hey2",
    createdAt: createDateString(),
    updatedAt: createDateString(),
  },
  {
    id: 3,
    name: "aung",
    email: "aung@gmail.com",
    password: "hey3",
    createdAt: createDateString(),
    updatedAt: createDateString(),
  },
];

const server = http.createServer((req, res) => {
  let url = req.url;
  console.log(url);
  if (url === "/data") {
    let data = "";
    if (req.method === "POST") {
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        users.push({
          ...JSON.parse(data),
          id: users.length + 1,
          createdAt: createDateString(),
          updatedAt: createDateString(),
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ status: "success" }));
        return res.end();
      });
    } else if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(users));
      return res.end();
    } else if (req.method === "PUT") {
      ///////////// PUT //////////////////
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        data = JSON.parse(data);

        const foundUser = users.find(
          (user) => user.id === Number.parseInt(data.id)
        );

        if (foundUser) {
          foundUser.name = data.name;
          foundUser.email = data.email;
          foundUser.password = data.password;
          foundUser.updatedAt = createDateString();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ status: "success" }));
          return res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ status: "fail" }));
          return res.end();
        }
      });
    } else if (req.method === "DELETE") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        data = JSON.parse(data);
        users = users.filter((user) => user.id !== Number.parseInt(data.id));
        res.write(JSON.stringify({ status: "success" }));
        return res.end();
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ status: "nope I only accept ok" }));
      return res.end();
    }
  } else if (url === "/fileUpload") {
    if (req.method === "POST") {
      if (!req.headers["content-type"]) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ status: "file is not insert" }));
        return res.end();
      }
      const fileType = req.headers["content-type"].split("/")[1];

      const fileStream = fs.createWriteStream(
        `files/image-${new Date().getTime()}.${fileType}`
      );
      req.pipe(fileStream);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ status: "write file is ended" }));
      return res.end();
    }
  } else {
    res.writeHead(404);
    return res.end();
  }
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
//libary
//it can save many file
// formidable
