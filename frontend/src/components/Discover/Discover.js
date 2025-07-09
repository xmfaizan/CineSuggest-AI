import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMovie } from "../../contexts/MovieContext";

// Import child components
import HeroSection from "./HeroSection";
import InputForm from "./InputForm";
import ResultsSection from "./ResultsSection";
import LoadingAnimation from "../Movies/LoadingAnimation";
import ErrorMessage from "../Toast/ErrorMessage";

const DiscoverContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: ${(props) => props.theme.colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0 ${(props) => props.theme.spacing.md};
  }
`;

const Discover = () => {
  const {
    recommendations,
    loading,
    error,
    currentAnalysis,
    setError,
    clearRecommendations,
  } = useMovie();

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setShowResults(recommendations.length > 0);
  }, [recommendations]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleNewSearch = () => {
    clearRecommendations();
    setShowResults(false);
  };

  return (
    <DiscoverContainer>
      <ContentWrapper>
        {/* Hero Section - Always visible */}
        <HeroSection />

        {/* Input Form - Hidden when showing results */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InputForm />
          </motion.div>
        )}

        {/* Loading Animation */}
        {loading && <LoadingAnimation />}

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Results Section */}
        {showResults && !loading && (
          <ResultsSection
            onNewSearch={handleNewSearch}
            analysis={currentAnalysis}
          />
        )}
      </ContentWrapper>
    </DiscoverContainer>
  );
};

export default Discover;
