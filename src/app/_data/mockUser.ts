import credentials from "next-auth/providers/credentials";

const mockAdminUser = {
    id: "1",
    name: "Admin",
    email: 'admin@example.com',
    isAdmin: true,
    createdAt: new Date(),
};

const mockNonAdminUser = {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    isAdmin: false,
    createdAt: new Date(),
};

export { mockAdminUser, mockNonAdminUser };
