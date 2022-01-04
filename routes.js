const fs = require("fs");

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button>Send</button></input></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    let body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const paserFile = Buffer.concat(body).toString();
      console.log(paserFile);
      const message = paserFile.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>First App Server</title></head>");
  res.write("<body><h1>I am feeling good </h1></body>");
  res.write("</html>");
  res.end();
}

module.exports = requestHandler