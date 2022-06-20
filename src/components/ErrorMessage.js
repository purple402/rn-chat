import React from "react";
import styled from "styled-components/native";
import propTypes from "prop-types";

const StyledText = styled.Text`
  align-items: flex-end;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const ErrorMessage = ({ message }) => {
  return <StyledText>{message}</StyledText>;
};

ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

export default ErrorMessage;
