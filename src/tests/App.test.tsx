import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from '../App';
import { renderWithContexts } from '../testHelpers/render';

test('App renders without crashing', () => {
  render(renderWithContexts(<App />));
  expect(screen.queryByTestId('app')).toBeInTheDocument();
});
