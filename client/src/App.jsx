import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import About from "./pages/About";
import Conference from "./pages/Conference";
import Conferences from "./pages/Conferences";
import NotFound from "./pages/NotFound";
import Article from "./pages/Article";

export default function App() {
  return (
    <>
      <nav className={styles.header}>here will be a nav at some point</nav>
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Conferences />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/conferences/:id" element={<Conference />} />
          <Route path="/conferences/:id/articles/:id" element={<Article />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
