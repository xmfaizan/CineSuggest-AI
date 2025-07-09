import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Film, Heart, Sparkles } from "lucide-react";

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0 ${(props) => props.theme.spacing.md};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  text-decoration: none;
  transition: color ${(props) => props.theme.transitions.normal};

  &:hover {
    color: ${(props) => props.theme.colors.primary.main};
  }

  svg {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  text-decoration: none;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    background: rgba(99, 102, 241, 0.1);
  }

  &.active {
    color: ${(props) => props.theme.colors.primary.main};
    background: rgba(99, 102, 241, 0.15);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    span {
      display: none;
    }
  }
`;

const Navbar = () => {
  const location = useLocation();

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Logo to="/">
        <Film size={32} />
        <span>CineAI</span>
      </Logo>

      <NavLinks>
        <NavLink to="/" className={location.pathname === "/" ? "active" : ""}>
          <Sparkles />
          <span>Discover</span>
        </NavLink>

        <NavLink
          to="/watchlist"
          className={location.pathname === "/watchlist" ? "active" : ""}
        >
          <Heart />
          <span>Watchlist</span>
        </NavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;
