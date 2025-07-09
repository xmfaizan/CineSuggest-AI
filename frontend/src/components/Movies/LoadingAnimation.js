import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Brain, Sparkles, Film } from "lucide-react";

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing["3xl"]}
    ${(props) => props.theme.spacing.lg};
  text-align: center;
`;

const LoadingAnimation = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const CircularProgress = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid ${(props) => props.theme.colors.primary.main};
  border-radius: 50%;
`;

const IconContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main},
    ${(props) => props.theme.colors.secondary.main}
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LoadingText = styled(motion.h3)`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const LoadingSubtext = styled(motion.p)`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-width: 500px;
`;

const ProcessSteps = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
`;

const ProcessStep = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.muted};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};

  .icon {
    color: ${(props) => props.theme.colors.primary.main};
  }

  &.active {
    color: ${(props) => props.theme.colors.text.primary};
    font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  }
`;

const SparkleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
`;

const SparkleIcon = styled(motion.div)`
  position: absolute;
  color: ${(props) => props.theme.colors.primary.main};
`;

const LoadingAnimationComponent = () => {
  const steps = [
    { icon: <Brain size={16} />, text: "Analyzing your input with AI..." },
    { icon: <Sparkles size={16} />, text: "Understanding your preferences..." },
    { icon: <Film size={16} />, text: "Finding perfect movie matches..." },
  ];

  return (
    <LoadingContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoadingAnimation>
        <CircularProgress
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <IconContainer
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain size={28} />
        </IconContainer>
      </LoadingAnimation>

      <LoadingText
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        AI is working its magic ✨
      </LoadingText>

      <LoadingSubtext
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Our artificial intelligence is analyzing your preferences and searching
        through thousands of movies to find the perfect recommendations for you.
      </LoadingSubtext>

      <ProcessSteps
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {steps.map((step, index) => (
          <ProcessStep
            key={index}
            className={index === 0 ? "active" : ""}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.2 }}
          >
            <span className="icon">{step.icon}</span>
            {step.text}
          </ProcessStep>
        ))}
      </ProcessSteps>

      {/* Floating sparkles */}
      <SparkleContainer>
        {[...Array(6)].map((_, i) => (
          <SparkleIcon
            key={i}
            style={{
              left: `${10 + i * 15}%`,
              top: `${Math.random() * 40}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={12 + Math.random() * 8} />
          </SparkleIcon>
        ))}
      </SparkleContainer>
    </LoadingContainer>
  );
};

export default LoadingAnimationComponent;
