import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export { UserContext };

// Users matching the seeded database IDs
const MOCK_USERS = [
  // Organizers
  {
    id: "11111111-1111-4111-1111-111111111111",
    name: "Alice Organizer",
    role: "ORGANIZER",
    email: "alice@conf.com",
  },
  {
    id: "11111111-1111-4111-1111-222222222222",
    name: "Bob Organizer",
    role: "ORGANIZER",
    email: "bob@conf.com",
  },
  {
    id: "11111111-1111-4111-1111-333333333333",
    name: "Mark Organizer",
    role: "ORGANIZER",
    email: "mark@conf.com",
  },
  // Reviewers
  {
    id: "22222222-2222-4222-2222-111111111111",
    name: "Charlie Reviewer",
    role: "REVIEWER",
    email: "charlie@rev.com",
  },
  {
    id: "22222222-2222-4222-2222-222222222222",
    name: "Diana Reviewer",
    role: "REVIEWER",
    email: "diana@rev.com",
  },
  {
    id: "22222222-2222-4222-2222-333333333333",
    name: "Evan Reviewer",
    role: "REVIEWER",
    email: "evan@rev.com",
  },
  {
    id: "22222222-2222-4222-2222-444444444444",
    name: "Fiona Reviewer",
    role: "REVIEWER",
    email: "fiona@rev.com",
  },
  {
    id: "22222222-2222-4222-2222-555555555555",
    name: "George Reviewer",
    role: "REVIEWER",
    email: "george@rev.com",
  },
  {
    id: "22222222-2222-4222-2222-666666666666",
    name: "Kelly Reviewer",
    role: "REVIEWER",
    email: "kelly@rev.com",
  },
  // Authors
  {
    id: "33333333-3333-4333-3333-111111111111",
    name: "Hannah Author",
    role: "AUTHOR",
    email: "hannah@uni.edu",
  },
  {
    id: "33333333-3333-4333-3333-222222222222",
    name: "Ian Author",
    role: "AUTHOR",
    email: "ian@uni.edu",
  },
  {
    id: "33333333-3333-4333-3333-333333333333",
    name: "Julia Author",
    role: "AUTHOR",
    email: "julia@uni.edu",
  },
  {
    id: "33333333-3333-4333-3333-444444444444",
    name: "Kevin Author",
    role: "AUTHOR",
    email: "kevin@uni.edu",
  },
  {
    id: "33333333-3333-4333-3333-555555555555",
    name: "Laura Author",
    role: "AUTHOR",
    email: "laura@uni.edu",
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
