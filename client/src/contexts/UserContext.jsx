import { createContext, useContext, useState } from "react";

const UserContext = createContext();

// Mock users with different roles and database-linked IDs
const MOCK_USERS = [
  {
    id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "John Smith",
    role: "Reviewer",
    email: "john.reviewer@conference.com",
  },
  {
    id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
    name: "Sarah Johnson",
    role: "Author",
    email: "sarah.author@conference.com",
  },
  {
    id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
    name: "Michael Chen",
    role: "Organizer",
    email: "michael.organizer@conference.com",
  },
];

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);

  const switchUser = (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        switchUser,
        allUsers: MOCK_USERS,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
