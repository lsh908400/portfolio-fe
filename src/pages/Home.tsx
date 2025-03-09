import React from 'react'
import backgroundVideo from '/public/assets/video_bg.webm';
import VideoBackground from '../component/pages/Home/VideoBackground';

const Home : React.FC = () => {
  return (
    <div id='home'>
      <VideoBackground 
        videoSrc={backgroundVideo}
      />
    </div>
  )
}

export default Home;
