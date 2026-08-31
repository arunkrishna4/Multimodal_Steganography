import "dotenv/config";

import app from "./app";

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`StegoShield backend running on port ${PORT}`);
});
