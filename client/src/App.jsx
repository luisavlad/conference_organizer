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
  const { currentUser, switchUser, allUsers } = useUser();

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
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
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
          <Route path="/conferences/:id/articles/:id" element={<Article />} />
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
