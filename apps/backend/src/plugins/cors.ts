import cors from "cors";

export default defineNitroPlugin((plugin) => {
  plugin.h3App.use(
    fromNodeMiddleware(
      cors({
        origin: ["http://localhost:3000"], // Specify exact origin instead of wildcard
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      }),
    ),
  );
});
