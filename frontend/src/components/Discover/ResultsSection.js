import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles, Brain } from "lucide-react";
import { useMovie } from "../../contexts/MovieContext";
import MovieGrid from "../Movies/MovieGrid";

const ResultsContainer = styled(motion.section)`
  padding: ${(props) => props.theme.spacing.xl} 0;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ResultsTitle = styled(motion.h2)`
  font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};

  .icon {
    color: ${(props) => props.theme.colors.primary.main};
    margin-right: ${(props) => props.theme.spacing.sm};
  }
`;

const ResultsSubtitle = styled(motion.p)`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const AnalysisCard = styled(motion.div)`
  background: rgba(51, 65, 85, 0.3);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  backdrop-filter: blur(10px);
`;

const AnalysisTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
`;

const AnalysisText = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-style: italic;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const SearchTerms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.xs};
`;

const SearchTerm = styled.span`
  background: rgba(99, 102, 241, 0.2);
  color: ${(props) => props.theme.colors.primary.main};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const NewSearchButton = styled(motion.button)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main},
    ${(props) => props.theme.colors.secondary.main}
  );
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const MovieCount = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text.muted};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ResultsSection = ({ onNewSearch, analysis }) => {
  const { recommendations } = useMovie();

  return (
    <ResultsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ResultsHeader>
        <ResultsTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="icon" size={32} />
          AI Recommendations for You
        </ResultsTitle>

        <ResultsSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Based on your inputs, here are movies that match your preferences
        </ResultsSubtitle>
      </ResultsHeader>

      {/* AI Analysis Card */}
      {analysis && (
        <AnalysisCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnalysisTitle>
            <Brain size={20} />
            AI Analysis
          </AnalysisTitle>

          {analysis.imageDescription && (
            <AnalysisText>
              <strong>Image Analysis:</strong> "{analysis.imageDescription}"
            </AnalysisText>
          )}

          {analysis.recommendedTitles &&
            analysis.recommendedTitles.length > 0 && (
              <div>
                <AnalysisText style={{ marginBottom: "8px" }}>
                  <strong>AI Recommended Movies:</strong>
                </AnalysisText>
                <SearchTerms>
                  {analysis.recommendedTitles.map((title, index) => (
                    <SearchTerm key={index}>{title}</SearchTerm>
                  ))}
                </SearchTerms>
              </div>
            )}

          {analysis.query && (
            <AnalysisText>
              <strong>Result:</strong> {analysis.query}
            </AnalysisText>
          )}
        </AnalysisCard>
      )}

      <ActionsBar>
        <NewSearchButton
          onClick={onNewSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={18} />
          New Search
        </NewSearchButton>
      </ActionsBar>

      <MovieCount>
        Found {recommendations.length} movie
        {recommendations.length !== 1 ? "s" : ""} for you
      </MovieCount>

      {/* Movie Grid */}
      <MovieGrid movies={recommendations} />
    </ResultsContainer>
  );
};

export default ResultsSection;
