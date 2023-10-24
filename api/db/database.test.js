const {db} = require('./database.js')
describe('Database Module', () => {
    let testDb; // Declare a variable for the test database connection

    beforeAll(() => {
        // Set up the test database
        testDb = db();
    });

    afterAll(() => {
        // Close the test database after all tests
        testDb.close();
    });

    it('should return a valid database connection', () => {
        expect(testDb).toBeDefined();
    });

    // Add more test cases to validate the functionality of your database module
});
