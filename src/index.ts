import colors from "colors";
import server from "./server";

//This port is created so you can use environment variables
const port = process.env.PORT || 4000;

//Here the server we created on server.ts
//will be called with the listen function using the port variable we instantiate
server.listen(port, () => {
  console.log(colors.cyan.bold(`REST API working on port ${port}`));
});
