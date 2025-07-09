import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Sparkles, Image, Type, Palette } from "lucide-react";

const HeroContainer = styled.section`
  padding: ${(props) => props.theme.spacing["3xl"]} 0
    ${(props) => props.theme.spacing.xl};
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${(props) => props.theme.spacing.xl} 0
      ${(props) => props.theme.spacing.lg};
  }
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at center top,
    rgba(99, 102, 241, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: ${(props) => props.theme.typography.fontSizes["5xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
  line-height: ${(props) => props.theme.typography.lineHeights.tight};

  .highlight {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.primary.main} 0%,
      ${(props) => props.theme.colors.secondary.main} 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradientShift 3s ease-in-out infinite;
  }

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: ${(props) => props.theme.typography.fontSizes["4xl"]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing["2xl"]};
  line-height: ${(props) => props.theme.typography.lineHeights.relaxed};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: ${(props) => props.theme.typography.fontSizes.lg};
  }
`;

const FeatureGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const FeatureCard = styled(motion.div)`
  background: rgba(51, 65, 85, 0.5);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.lg};
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    background: rgba(51, 65, 85, 0.7);
    border-color: ${(props) => props.theme.colors.primary.main};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${(props) => props.theme.spacing.md};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main},
    ${(props) => props.theme.colors.secondary.main}
  );
  border-radius: ${(props) => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const FeatureDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.text.muted};
  line-height: ${(props) => props.theme.typography.lineHeights.relaxed};
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main}20,
    ${(props) => props.theme.colors.secondary.main}20
  );
  border-radius: ${(props) => props.theme.borderRadius.full};
  pointer-events: none;
`;

const HeroSection = () => {
  const features = [
    {
      icon: <Image size={24} />,
      title: "Image Analysis",
      description:
        "Upload an image and let AI understand the mood and aesthetic",
    },
    {
      icon: <Type size={24} />,
      title: "Text Prompts",
      description: "Describe what you're looking for in natural language",
    },
    {
      icon: <Palette size={24} />,
      title: "Mood Selection",
      description: "Choose from various genres and moods to refine your search",
    },
  ];

  return (
    <HeroContainer>
      <BackgroundGradient />

      {/* Floating Elements */}
      <FloatingElement
        style={{
          top: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <FloatingElement
        style={{
          top: "60%",
          right: "15%",
          width: "60px",
          height: "60px",
        }}
        animate={{
          y: [0, 15, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <HeroContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover Movies with{" "}
          <span className="highlight">
            <Sparkles
              style={{ display: "inline", marginRight: "8px" }}
              size={48}
            />
            AI Magic
          </span>
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Upload an image, describe your mood, or tell us what you're feeling.
          Our AI will find the perfect movies that match your vibe.
        </Subtitle>

        <FeatureGrid
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
