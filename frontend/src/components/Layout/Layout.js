import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.background};
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding-top: 80px; /* Account for fixed navbar */
  min-height: calc(100vh - 80px);
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
