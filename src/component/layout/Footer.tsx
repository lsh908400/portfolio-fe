import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className='flex h-[20px] bg-footer-primary min-h-[20px] max-h-[20px]'>
      <p className='flex justify-center w-full text-gray-300 text-[11px]'>&copy; 2025 Your Company. All rights reserved.</p>
    </footer>
  );
};

export default Footer;