import React from 'react';
import Introduce from '../component/pages/Profile/Introduce';

const Profile: React.FC = () => {
  return (
    <main id="profile" className='h-full bg-white'>
      <Introduce />
    </main>
  );
};

export default Profile;