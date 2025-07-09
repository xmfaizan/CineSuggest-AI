import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/themes";

// Components
import Layout from "./components/Layout/Layout";
import Discover from "./components/Discover/Discover";
import Watchlist from "./components/Watchlist/Watchlist";

// Context
import { MovieProvider } from "./contexts/MovieContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <MovieProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </Layout>
        </Router>
      </MovieProvider>
    </ThemeProvider>
  );
}

export default App;
