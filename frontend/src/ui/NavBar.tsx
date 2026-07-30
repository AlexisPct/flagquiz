import './NavBar.css';
import { ThemeSwitch } from '../ui/ThemeSwitch';
import { HomeButton } from '../ui/HomeButton';

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-item">
                <HomeButton />
            </div>
            <div className="navbar-divider" />
            <div className="navbar-item">
                <ThemeSwitch />
            </div>
        </nav>
    );
}