const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Articles = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("tester API articles", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      title: "mon titre",
      content: "hello world !",
      user: "roger",
      state: "draft"
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "mon titre 2",
    content: "hello world 2 !",
    user: "norbert",
    state: "draft"
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(Articles).toReturn(MOCK_DATA, "find");
    mockingoose(Articles).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Articles] Get All", async () => {
    const res = await request(app)
      .get("/api/articles")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // I don't know why this part don't work
  test("[Articles] Create Articles", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
  
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("Est-ce articlesService.getAll", async () => {
    const spy = jest
      .spyOn(articlesService, "getAll")
      .mockImplementation(() => "test");
    await request(app).get("/api/articles").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
