import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import Navbar from '../components/Navbar';


describe('App Component', () => {
  test('renders the main app', () => {
    render(<App />);
    const logo = screen.getByAltText(/react/i); // assuming react.svg logo
    expect(logo).toBeInTheDocument();
  });
});


describe('Navbar Component', () => {
  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const homeLink = screen.getByText(/home/i);
    const loginLink = screen.getByText(/login/i);
    expect(homeLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});
