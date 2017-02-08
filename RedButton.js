import React, { Component } from 'react';
import styled from 'styled-components/native';

const StyledButton = styled.Button`
  background-color: papayawhip;
  color: red;
`;

export default class RedButton extends Component {
  render() {
    return (
      <StyledButton {...this.props} />
    )
  }
}
