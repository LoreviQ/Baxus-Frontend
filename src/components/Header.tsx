import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex gap-4">
        <NavLink 
          to="/whiskeygoggles" 
          className={({ isActive }) => 
            `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          Whiskey Goggles
        </NavLink>
        <NavLink 
          to="/bob" 
          className={({ isActive }) => 
            `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          Bob
        </NavLink>
        <NavLink 
          to="/honeybarrel" 
          className={({ isActive }) => 
            `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          Honey Barrel
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;