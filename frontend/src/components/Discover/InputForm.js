import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Upload,
  X,
  Send,
  Image as ImageIcon,
  Type,
  Palette,
} from "lucide-react";
import { useMovie } from "../../contexts/MovieContext";
import { movieAPI } from "../../utils/api";

const FormContainer = styled(motion.section)`
  background: rgba(51, 65, 85, 0.3);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius["2xl"]};
  padding: ${(props) => props.theme.spacing["2xl"]};
  margin: ${(props) => props.theme.spacing.xl} 0;
  backdrop-filter: blur(10px);
`;

const FormTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const ImageUploadArea = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  background: rgba(51, 65, 85, 0.2);
  position: relative;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main};
    background: rgba(99, 102, 241, 0.1);
  }

  &.dragover {
    border-color: ${(props) => props.theme.colors.primary.main};
    background: rgba(99, 102, 241, 0.2);
  }
`;

const UploadIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${(props) => props.theme.spacing.md};
  background: rgba(99, 102, 241, 0.1);
  border-radius: ${(props) => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary.main};
`;

const UploadText = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const UploadSubtext = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.text.muted};
`;

const ImagePreview = styled.div`
  position: relative;
  display: inline-block;
  margin-top: ${(props) => props.theme.spacing.md};
`;

const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 150px;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: ${(props) => props.theme.borderRadius.full};
  background: ${(props) => props.theme.colors.error};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  background: rgba(51, 65, 85, 0.3);
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  resize: vertical;
  transition: all ${(props) => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    background: rgba(51, 65, 85, 0.5);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.muted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  background: rgba(51, 65, 85, 0.3);
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
    background: rgba(51, 65, 85, 0.5);
  }

  option {
    background: ${(props) => props.theme.colors.surface};
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary.main},
    ${(props) => props.theme.colors.secondary.main}
  );
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const RequirementText = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.text.muted};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  font-style: italic;
`;

const InputForm = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const { setLoading, setError, setRecommendations, setCurrentAnalysis } =
    useMovie();

  // Predefined mood options
  const moodOptions = [
    { value: "", label: "Select a mood/genre..." },
    { value: "action", label: "🎬 Action & Adventure" },
    { value: "comedy", label: "😄 Comedy & Fun" },
    { value: "drama", label: "🎭 Drama & Emotional" },
    { value: "horror", label: "👻 Horror & Thriller" },
    { value: "romance", label: "💕 Romance & Love" },
    { value: "sci-fi", label: "🚀 Sci-Fi & Fantasy" },
    { value: "mystery", label: "🔍 Mystery & Crime" },
    { value: "documentary", label: "📚 Documentary" },
    { value: "family", label: "👨‍👩‍👧‍👦 Family & Kids" },
    { value: "dark", label: "🖤 Dark & Intense" },
    { value: "light", label: "☀️ Light & Uplifting" },
    { value: "nostalgic", label: "🌅 Nostalgic & Classic" },
  ];

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - at least one input required
    if (!image && !text.trim() && !mood) {
      setError(
        "Please provide at least one input: image, text description, or mood"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for the request
      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }
      if (text.trim()) {
        formData.append("text", text.trim());
      }
      if (mood) {
        formData.append("mood", mood);
      }

      // Make API request
      const response = await movieAPI.getRecommendations(formData);

      if (response.success) {
        setRecommendations(response.data.movies);
        setCurrentAnalysis(response.data.aiAnalysis);
      } else {
        setError("Failed to get recommendations. Please try again.");
      }
    } catch (error) {
      console.error("Recommendation error:", error);
      setError(
        error.message || "Failed to get recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = image || text.trim() || mood;

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <FormTitle>Tell us what you're looking for</FormTitle>

      <RequirementText>
        Provide at least one input to get personalized movie recommendations
      </RequirementText>

      <form onSubmit={handleSubmit}>
        <InputGrid>
          {/* Image Upload */}
          <InputGroup>
            <Label>
              <ImageIcon size={16} />
              Upload an Image (Optional)
            </Label>
            <ImageUploadArea
              className={isDragOver ? "dragover" : ""}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <ImagePreview>
                  <PreviewImage src={imagePreview} alt="Preview" />
                  <RemoveImageButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    <X size={14} />
                  </RemoveImageButton>
                </ImagePreview>
              ) : (
                <>
                  <UploadIcon>
                    <Upload size={24} />
                  </UploadIcon>
                  <UploadText>Click to upload or drag and drop</UploadText>
                  <UploadSubtext>PNG, JPG, GIF up to 5MB</UploadSubtext>
                </>
              )}
            </ImageUploadArea>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </InputGroup>

          {/* Mood Selection */}
          <InputGroup>
            <Label>
              <Palette size={16} />
              Choose a Mood/Genre (Optional)
            </Label>
            <Select value={mood} onChange={(e) => setMood(e.target.value)}>
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </InputGroup>
        </InputGrid>

        {/* Text Input - Full Width */}
        <InputGroup>
          <Label>
            <Type size={16} />
            Describe what you're looking for (Optional)
          </Label>
          <TextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., 'Movies like Inception with complex plots', 'Romantic comedies from the 90s', 'Dark psychological thrillers', etc."
            maxLength={500}
          />
        </InputGroup>

        {/* Submit Button */}
        <SubmitButton
          type="submit"
          disabled={!isFormValid}
          whileHover={{ scale: isFormValid ? 1.02 : 1 }}
          whileTap={{ scale: isFormValid ? 0.98 : 1 }}
        >
          <Send size={20} />
          Get AI Recommendations
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default InputForm;
