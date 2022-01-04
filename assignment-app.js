const http = require("http");
const users = ["Christian", "Paul"];
const serever = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Assignment One</title></head>");
    res.write(
      "<body><h1>Hello my people, this is my first NodeJS Assignment</h1>"
    );
    res.write(
      '<form action="/create-user" method="POST"><label>Input username</label><input type="text" name="username"></input><br><button>Submit</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/user") {
    res.write("<html>");
    res.write("<head><title>Assignment One</title></head>");
    res.write("<body><h1>List of Users</h1><br><ul>");
    res.write(`${users.map((user) => `<li>${user}</li>`)}`);
    res.write("</ul></body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    let body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const paserFile = Buffer.concat(body).toString();
      console.log(paserFile);
      const message = paserFile.split("=")[1];
      users.push(message)
      res.setHeader("Location", "/");
      return res.end()
     
    });
  }
//   res.setHeader("Content-Type", "text/html");
//   res.write("<html>");
//   res.write("<head><title>First App Server</title></head>");
//   res.write("<body><h1>I am feeling good </h1></body>");
//   res.write("</html>");
//   res.end();
});

serever.listen(3000);
