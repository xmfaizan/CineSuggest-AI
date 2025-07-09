import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Heart, Film } from "lucide-react";
import { useMovie } from "../../contexts/MovieContext";
import { watchlistAPI } from "../../utils/api";
import MovieGrid from "../Movies/MovieGrid";
import LoadingAnimation from "../Movies/LoadingAnimation";

const WatchlistContainer = styled.div`
  min-height: calc(100vh - 160px);
  padding: ${(props) => props.theme.spacing.xl}
    ${(props) => props.theme.spacing.lg};
`;

const WatchlistHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const WatchlistTitle = styled(motion.h1)`
  font-size: ${(props) => props.theme.typography.fontSizes["4xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};

  .icon {
    color: ${(props) => props.theme.colors.secondary.main};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  }
`;

const WatchlistSubtitle = styled(motion.p)`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const EmptyWatchlist = styled(motion.div)`
  text-align: center;
  padding: ${(props) => props.theme.spacing["3xl"]} 0;
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${(props) => props.theme.spacing.xl};
  background: rgba(99, 102, 241, 0.1);
  border-radius: ${(props) => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary.main};
`;

const EmptyTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const EmptyMessage = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const WatchlistStats = styled(motion.div)`
  background: rgba(51, 65, 85, 0.3);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: center;
  backdrop-filter: blur(10px);
`;

const StatsText = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const Watchlist = () => {
  const { watchlist, loading, setLoading, setError, setWatchlist } = useMovie();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const response = await watchlistAPI.getWatchlist();
      if (response.success) {
        setWatchlist(response.data.movies);
      } else {
        setError("Failed to load watchlist");
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      setError("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <WatchlistContainer>
      <WatchlistHeader>
        <WatchlistTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="icon" size={40} />
          My Watchlist
        </WatchlistTitle>

        <WatchlistSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Movies you've saved to watch later
        </WatchlistSubtitle>
      </WatchlistHeader>

      {watchlist.length > 0 ? (
        <>
          <WatchlistStats
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatsText>
              You have {watchlist.length} movie
              {watchlist.length !== 1 ? "s" : ""} in your watchlist
            </StatsText>
          </WatchlistStats>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MovieGrid movies={watchlist} />
          </motion.div>
        </>
      ) : (
        <EmptyWatchlist
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <EmptyIcon>
            <Film size={48} />
          </EmptyIcon>
          <EmptyTitle>Your watchlist is empty</EmptyTitle>
          <EmptyMessage>
            Start discovering movies and add them to your watchlist by clicking
            the heart icon!
          </EmptyMessage>
        </EmptyWatchlist>
      )}
    </WatchlistContainer>
  );
};

export default Watchlist;
