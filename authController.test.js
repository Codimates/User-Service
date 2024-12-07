const { createUser, updateUser } = require('./controllers/userController'); // Adjust the path as needed
const User = require('./models/user'); // Adjust the path to the User model

jest.mock('./models/user'); // Mock the User model

describe('User Controller', () => {
    describe('createUser', () => {
        it('should create a user and return a success response', async () => {
            // Mock request and response
            const req = {
                body: {
                    fname: 'John',
                    lname: 'Doe',
                    email: 'john.doe@example.com',
                    phone_number: '1234567890',
                    password: 'password123',
                    role: 'user',
                    address: '123 Main St',
                    image: 'image.jpg'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock User.save()
            const mockSave = jest.fn().mockResolvedValue({
                _id: 'fakeId123',
                ...req.body
            });
            User.mockImplementation(() => ({ save: mockSave }));

            // Call the createUser function
            await createUser(req, res);

            // Assertions
            expect(User).toHaveBeenCalledWith(req.body);
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User created successfully',
                data: expect.objectContaining({
                    _id: 'fakeId123',
                    fname: 'John',
                    lname: 'Doe',
                    email: 'john.doe@example.com',
                    phone_number: '1234567890',
                    password: 'password123',
                    role: 'user',
                    address: '123 Main St',
                    image: 'image.jpg'
                })
            });
        });

        it('should handle errors and return a 500 response', async () => {
            // Mock request and response
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock User.save() to throw an error
            const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
            User.mockImplementation(() => ({ save: mockSave }));

            // Call the createUser function
            await createUser(req, res);

            // Assertions
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error'
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user and return a success response', async () => {
            // Mock request and response
            const req = {
                params: { id: 'fakeId123' },
                body: {
                    fname: 'Jane',
                    lname: 'Doe',
                    email: 'jane.doe@example.com',
                    phone_number: '9876543210',
                    password: 'newpassword123',
                    role: 'admin',
                    address: '456 Another St',
                    image: 'newimage.jpg'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock User.findByIdAndUpdate()
            const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({
                _id: 'fakeId123',
                ...req.body
            });
            User.findByIdAndUpdate = mockFindByIdAndUpdate;

            // Call the updateUser function
            await updateUser(req, res);

            // Assertions
            expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
                'fakeId123',
                req.body,
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User updated successfully',
                data: expect.objectContaining({
                    _id: 'fakeId123',
                    fname: 'Jane',
                    lname: 'Doe',
                    email: 'jane.doe@example.com',
                    phone_number: '9876543210',
                    password: 'newpassword123',
                    role: 'admin',
                    address: '456 Another St',
                    image: 'newimage.jpg'
                })
            });
        });

        it('should handle errors and return a 500 response', async () => {
            // Mock request and response
            const req = {
                params: { id: 'fakeId123' },
                body: {}
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock User.findByIdAndUpdate() to throw an error
            const mockFindByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));
            User.findByIdAndUpdate = mockFindByIdAndUpdate;

            // Call the updateUser function
            await updateUser(req, res);

            // Assertions
            expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('fakeId123', {}, { new: true });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error'
            });
        });
    });
});
