import React from "react";

const Navbar = () => {
  return (
    <div className="m-4 flex justify-between">
      <div>Frankpower Tech LTD</div>
      <div>
        <nav>
          <li>Home</li>
          <li>Alumini</li>
          <li>About</li>
          <li>Contact</li>
        </nav>
      </div>
      <div>
        <button>Register</button>
      </div>
    </div>
  );
};

export default Navbar;
