import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 1001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Health check: http://localhost:${PORT}/api/v1/health`);
});
