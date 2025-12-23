// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../Button';  // Note: Using named import since you're exporting as named export

describe('Button Component', () => {
  it('renders button with correct label', () => {
    render(<Button label="Send Money" />);  // Using label prop
    const button = screen.getByText('Send Money');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Send Money" onClick={handleClick} />);
    
    const button = screen.getByText('Send Money');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});