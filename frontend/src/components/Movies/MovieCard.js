import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Heart, Star, Calendar, Eye } from "lucide-react";
import { useMovie } from "../../contexts/MovieContext";
import { watchlistAPI } from "../../utils/api";

const CardContainer = styled(motion.div)`
  background: rgba(51, 65, 85, 0.4);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  overflow: hidden;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.shadows.xl};
    border-color: ${(props) => props.theme.colors.primary.main};
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${(props) => props.theme.transitions.slow};

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const PosterPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.surface},
    ${(props) => props.theme.colors.card}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.muted};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  text-align: center;
  padding: ${(props) => props.theme.spacing.lg};
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity ${(props) => props.theme.transitions.normal};

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const WatchlistButton = styled(motion.button)`
  position: absolute;
  top: ${(props) => props.theme.spacing.md};
  right: ${(props) => props.theme.spacing.md};
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.borderRadius.full};
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) =>
    props.inWatchlist
      ? props.theme.colors.secondary.main
      : props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background: ${(props) =>
      props.inWatchlist
        ? props.theme.colors.secondary.main
        : "rgba(99, 102, 241, 0.2)"};
    color: white;
    transform: scale(1.1);
  }

  svg {
    fill: ${(props) => (props.inWatchlist ? "currentColor" : "none")};
  }
`;

const RatingBadge = styled.div`
  position: absolute;
  bottom: ${(props) => props.theme.spacing.md};
  left: ${(props) => props.theme.spacing.md};
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.warning};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
`;

const CardContent = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MovieTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  line-height: ${(props) => props.theme.typography.lineHeights.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MovieOverview = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  line-height: ${(props) => props.theme.typography.lineHeights.relaxed};
  margin-bottom: ${(props) => props.theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const MovieMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${(props) => props.theme.spacing.sm};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const ReleaseDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.muted};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
`;

const ViewButton = styled(motion.button)`
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid ${(props) => props.theme.colors.primary.main};
  color: ${(props) => props.theme.colors.primary.main};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background: ${(props) => props.theme.colors.primary.main};
    color: white;
  }
`;

const MovieCard = ({ movie, index }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useMovie();

  const imageBaseUrl =
    process.env.REACT_APP_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";
  const posterUrl = movie.posterPath
    ? `${imageBaseUrl}${movie.posterPath}`
    : null;

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (inWatchlist) {
        await watchlistAPI.removeFromWatchlist(movie._id);
        setInWatchlist(false);
      } else {
        await watchlistAPI.addToWatchlist(movie._id);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      setError("Failed to update watchlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    // TODO: Implement movie details modal or navigation
    console.log("View details for:", movie.title);
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return rating.toFixed(1);
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <PosterContainer>
        {posterUrl ? (
          <PosterImage
            src={posterUrl}
            alt={movie.title}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : (
          <PosterPlaceholder>No poster available</PosterPlaceholder>
        )}

        <Overlay />

        <WatchlistButton
          inWatchlist={inWatchlist}
          onClick={handleWatchlistToggle}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={20} />
        </WatchlistButton>

        {movie.voteAverage && (
          <RatingBadge>
            <Star size={14} fill="currentColor" />
            {formatRating(movie.voteAverage)}
          </RatingBadge>
        )}
      </PosterContainer>

      <CardContent>
        <MovieTitle>{movie.title}</MovieTitle>

        {movie.overview && <MovieOverview>{movie.overview}</MovieOverview>}

        <MovieMeta>
          <ReleaseDate>
            <Calendar size={12} />
            {formatReleaseDate(movie.releaseDate)}
          </ReleaseDate>

          <ViewButton
            onClick={handleViewDetails}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={12} />
            Details
          </ViewButton>
        </MovieMeta>
      </CardContent>
    </CardContainer>
  );
};

export default MovieCard;
