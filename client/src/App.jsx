import { Link, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { useUser } from "./contexts/UserContext";
import Article from "./pages/Article";
import Conference from "./pages/Conference";
import Conferences from "./pages/Conferences";
import CreateConference from "./pages/CreateConference";
import EditArticle from "./pages/EditArticle";
import JoinConference from "./pages/JoinConference";
import NotFound from "./pages/NotFound";

export default function App() {
  const { currentUser, switchUser, allUsers, currentArticle } = useUser();

  // Helper function to check if user can access the current article
  const canUserAccessArticle = (user) => {
    if (!currentArticle) return true; // No article context, allow all
    if (user.role === "ORGANIZER") return true; // Organizers always have access
    if (user.role === "AUTHOR") {
      return user.id === currentArticle.authorId; // Only the article author
    }
    if (user.role === "REVIEWER") {
      return (
        user.id === currentArticle.reviewer1Id ||
        user.id === currentArticle.reviewer2Id
      ); // Only assigned reviewers
    }
    return false;
  };

  return (
    <>
      <nav className={styles.header}>
        <div className={styles.navContent}>
          <Link to="/" className={`${styles.link}`}>
            Conference Organizer
          </Link>
          <div className={styles.userDropdown}>
            <label htmlFor="userSelect">Preview as: </label>
            <select
              id="userSelect"
              value={currentUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className={styles.userSelect}
            >
              {allUsers.map((user) => {
                const hasAccess = canUserAccessArticle(user);
                return (
                  <option 
                    key={user.id} 
                    value={user.id}
                    disabled={!hasAccess}
                    style={{ 
                      color: hasAccess ? 'inherit' : '#999',
                      fontStyle: hasAccess ? 'normal' : 'italic'
                    }}
                  >
                    {hasAccess ? '' : '🔒 '}
                    {user.name} - {user.role}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Conferences />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/conferences/create" element={<CreateConference />} />
          <Route path="/conferences/:id" element={<Conference />} />
          <Route path="/conferences/:id/join" element={<JoinConference />} />
          <Route path="/conferences/:conferenceId/articles/:articleId" element={<Article />} />
          <Route
            path="/conferences/:conferenceId/articles/:articleId/edit"
            element={<EditArticle />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
