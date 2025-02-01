import request from "supertest";
import app from "../../../app.js";

describe("URL Shortener API", () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/google")
      .send({ credential: "test-token" });

    authToken = res.body.accessToken;
  });

  test("POST /api/shorten - Create short URL", async () => {
    const response = await request(app)
      .post("/api/shorten")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        longUrl: "https://example.com",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("shortUrl");
  });
});
