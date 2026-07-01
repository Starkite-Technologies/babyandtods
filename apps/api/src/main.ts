import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import compression from "compression";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // TEMPORARY DIAGNOSTIC — logs how long each API request actually takes on
  // the server, so we can tell whether a slow page is caused by the API/DB
  // or by something on the Next.js side (e.g. dev-server route compilation).
  // Read the numbers in this terminal (npm run dev:api) after clicking
  // around the admin pages. Safe to delete this block once confirmed.
  app.use((req: import("express").Request, res: import("express").Response, next: () => void) => {
    const start = process.hrtime.bigint();
    res.on("finish", () => {
      const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
      // eslint-disable-next-line no-console
      console.log(`[api-timing] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms.toFixed(1)}ms`);
    });
    next();
  });

  app.use(compression());
  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(",") ?? [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}/api`);
}

bootstrap();
