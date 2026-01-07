import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white mt-10 inset-shadow-sm inset-shadow-slate-500/20">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 text-center">
        © {new Date().getFullYear()} ASG SHOP. All rights reserved.
      </div>
    </footer>
    
  );
};

export default Footer;