import app from "./app";
import "./config/env";
import { env } from "./config/env";

const port = env.PORT;

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`app running at port:${port}`);
  }
});
