import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  padding: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const EmptyState = styled(motion.div)`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${(props) => props.theme.spacing["3xl"]}
    ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.text.muted};
`;

const EmptyMessage = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const EmptySubtext = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
`;

const MovieGrid = ({ movies = [] }) => {
  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EmptyMessage>No movies found</EmptyMessage>
        <EmptySubtext>
          Try adjusting your search criteria or try a different
          image/description.
        </EmptySubtext>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie._id || movie.tmdbId || index}
          movie={movie}
          index={index}
        />
      ))}
    </GridContainer>
  );
};

export default MovieGrid;
