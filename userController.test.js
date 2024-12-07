const { loginUser, loginoparational, loginCustomer, getprofile, logoutUser } = require("../controllers/authController");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../helpers/auth");

jest.mock("../models/user"); // Mock User model
jest.mock("jsonwebtoken"); // Mock JWT module
jest.mock("../helpers/auth"); // Mock comparePassword helper

describe("Auth Controller", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password123"
            },
            cookies: {}
        };

        res = {
            cookie: jest.fn().mockReturnThis(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            clearCookie: jest.fn()
        };
    });

    describe("loginUser", () => {
        it("should log in a user and return a token", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword", fname: "John", lname: "Doe", role: "user" };

            User.findOne.mockResolvedValue(user);
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockImplementation((payload, secret, options, callback) => callback(null, "mockToken"));

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(comparePassword).toHaveBeenCalledWith(req.body.password, user.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user._id, fname: user.fname, lname: user.lname, role: user.role },
                process.env.REACT_APP_JWT_SECRET,
                {},
                expect.any(Function)
            );
            expect(res.cookie).toHaveBeenCalledWith("token", "mockToken");
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it("should return error if user not found", async () => {
            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.json).toHaveBeenCalledWith({ error: "No user found" });
        });

        it("should return error if password is incorrect", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword" };

            User.findOne.mockResolvedValue(user);
            comparePassword.mockResolvedValue(false);

            await loginUser(req, res);

            expect(comparePassword).toHaveBeenCalledWith(req.body.password, user.password);
            expect(res.json).toHaveBeenCalledWith({ error: "Incorrect password" });
        });

        it("should return server error if an exception occurs", async () => {
            User.findOne.mockRejectedValue(new Error("Database error"));

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("loginoparational", () => {
        it("should log in an allowed user and return a token", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword", role: "admin", fname: "Admin", lname: "User" };

            User.findOne.mockResolvedValue(user);
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockImplementation((payload, secret, options, callback) => callback(null, "mockToken"));

            await loginoparational(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(comparePassword).toHaveBeenCalledWith(req.body.password, user.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user._id, fname: user.fname, lname: user.lname, role: user.role, email: user.email },
                process.env.REACT_APP_JWT_SECRET,
                {},
                expect.any(Function)
            );
            expect(res.cookie).toHaveBeenCalledWith("token", "mockToken");
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it("should return error if user not found", async () => {
            User.findOne.mockResolvedValue(null);

            await loginoparational(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.json).toHaveBeenCalledWith({ error: "No user found" });
        });

        it("should return error for unauthorized roles", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword", role: "user" };

            User.findOne.mockResolvedValue(user);

            await loginoparational(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized access: Invalid role" });
        });

        it("should return error if password is incorrect", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword", role: "admin" };

            User.findOne.mockResolvedValue(user);
            comparePassword.mockResolvedValue(false);

            await loginoparational(req, res);

            expect(comparePassword).toHaveBeenCalledWith(req.body.password, user.password);
            expect(res.json).toHaveBeenCalledWith({ error: "Incorrect password" });
        });

        it("should return server error if an exception occurs", async () => {
            User.findOne.mockRejectedValue(new Error("Database error"));

            await loginoparational(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("loginCustomer", () => {
        it("should log in a customer and return a token", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword", role: "customer", fname: "John", lname: "Doe" };

            User.findOne.mockResolvedValue(user);
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockImplementation((payload, secret, options, callback) => callback(null, "mockToken"));

            await loginCustomer(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(comparePassword).toHaveBeenCalledWith(req.body.password, user.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user._id, fname: user.fname, lname: user.lname, role: user.role, email: user.email },
                process.env.REACT_APP_JWT_SECRET,
                {},
                expect.any(Function)
            );
            expect(res.cookie).toHaveBeenCalledWith("token", "mockToken");
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it("should return error for unauthorized roles", async () => {
            const user = { _id: "user123", email: "test@example.com", password: "hashedPassword", role: "admin" };

            User.findOne.mockResolvedValue(user);

            await loginCustomer(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized access: Invalid role" });
        });
    });

    describe("getprofile", () => {
        it("should return user profile for a valid token", async () => {
            const user = { _id: "user123", email: "test@example.com", fname: "John", lname: "Doe", role: "customer" };
            req.cookies.token = "mockToken";

            jwt.verify.mockImplementation((token, secret, options, callback) => callback(null, { id: "user123" }));
            User.findById.mockResolvedValue(user);

            await getprofile(req, res);

            expect(jwt.verify).toHaveBeenCalledWith(req.cookies.token, process.env.REACT_APP_JWT_SECRET, {}, expect.any(Function));
            expect(User.findById).toHaveBeenCalledWith("user123");
            expect(res.json).toHaveBeenCalledWith({
                email: user.email,
                _id: user._id,
                fname: user.fname,
                lname: user.lname,
                role: user.role
            });
        });
    });

    describe("logoutUser", () => {
        it("should clear the token cookie and return success message", () => {
            logoutUser(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith("token");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
        });
    });
});
