import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Heart, Github, Linkedin, Mail } from "lucide-react";

const FooterContainer = styled(motion.footer)`
  background: ${(props) => props.theme.colors.surface};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.xl}
    ${(props) => props.theme.spacing.lg};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${(props) => props.theme.spacing.lg};
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const FooterText = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};

  .heart {
    color: ${(props) => props.theme.colors.secondary.main};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme.borderRadius.full};
  background: rgba(99, 102, 241, 0.1);
  color: ${(props) => props.theme.colors.text.secondary};
  text-decoration: none;
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background: ${(props) => props.theme.colors.primary.main};
    color: white;
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TechStack = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  text-align: center;
  color: ${(props) => props.theme.colors.text.muted};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};

  span {
    color: ${(props) => props.theme.colors.primary.main};
    font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  }
`;

const Footer = () => {
  return (
    <FooterContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <FooterContent>
        <FooterText>
          Made with <Heart className="heart" size={16} /> for my college project
        </FooterText>

        <SocialLinks>
          <SocialLink
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github />
          </SocialLink>

          <SocialLink
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin />
          </SocialLink>

          <SocialLink
            href="mailto:your-email@example.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail />
          </SocialLink>
        </SocialLinks>
      </FooterContent>

      <TechStack>
        Built with <span>React</span> • <span>Node.js</span> •{" "}
        <span>MongoDB</span> • <span>AI/ML</span> • <span>TMDB API</span>
      </TechStack>
    </FooterContainer>
  );
};

export default Footer;
