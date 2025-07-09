import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useMovie } from "../../contexts/MovieContext";

const ErrorContainer = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${(props) => props.theme.colors.error};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  margin: ${(props) => props.theme.spacing.lg} 0;
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.md};
  position: relative;
`;

const IconContainer = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.colors.error};
  margin-top: 2px;
`;

const ErrorContent = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.h4`
  color: ${(props) => props.theme.colors.error};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  line-height: ${(props) => props.theme.typography.lineHeights.relaxed};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.md};
  right: ${(props) => props.theme.spacing.md};
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ErrorMessage = ({ message }) => {
  const { setError } = useMovie();

  const handleClose = () => {
    setError(null);
  };

  if (!message) return null;

  return (
    <ErrorContainer
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <IconContainer>
        <AlertCircle size={24} />
      </IconContainer>

      <ErrorContent>
        <ErrorTitle>Oops! Something went wrong</ErrorTitle>
        <ErrorText>{message}</ErrorText>
      </ErrorContent>

      <CloseButton onClick={handleClose}>
        <X size={20} />
      </CloseButton>
    </ErrorContainer>
  );
};

export default ErrorMessage;
