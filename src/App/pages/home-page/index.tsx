// import './homepage.css';
// import * as React from 'react';
// import { Box, Flex, Stack, keyframes, usePrefersReducedMotion } from '@chakra-ui/react';
// import { FaDiscord, FaGithub, FaMedium, FaTelegram, FaTwitter } from 'react-icons/fa';
// import { SocialButton } from '../../components';
// import heraHomepage from '../../assets/hera_bg2.jpeg';
// import heraText from '../../assets/hera_text_dark.svg';

// const fadeIn = keyframes`
//   from { opacity: 0; }
//   to { opacity: 1; }
// `;

// export const HomePage = () => {
//   const [showImage, setShowImage] = React.useState(false);
//   const prefersReducedMotion = usePrefersReducedMotion();

//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowImage(true);
//     }, 100); // 5000ms = 5 seconds

//     return () => clearTimeout(timer);
//   }, []);

//   const animation = prefersReducedMotion ? undefined : `${fadeIn} 5s ease-in-out`;

//   return (
//     <React.Fragment>
//       <Flex flexDirection='column' alignItems={['flex-end', 'center']}>

//         <Box w='100vw' h='100vh' backgroundImage={`url(${heraHomepage})`} zIndex='-1' position='relative' backgroundSize='cover'>
//           {showImage && (
//             <Box
//               as="img"
//               src={heraText}
//               alt="Hera Text"
//               animation={animation}
//               position="absolute"
//               top="18%"
//               left="40%"
//               transform="translate(-50%, -50%)"
//               maxW="70%"
//               maxH="80%"
//             />
//           )}
//         </Box>
import './homepage.css';
import * as React from 'react';
import { Box, Flex, Stack, keyframes, usePrefersReducedMotion } from '@chakra-ui/react';
import { FaDiscord, FaGithub, FaMedium, FaTelegram, FaTwitter } from 'react-icons/fa';
import { SocialButton } from '../../components';
import heraText from '../../assets/hera_text_dark.svg';
import heraVideo from '../../assets/hera2.mp4'; // Import the video file

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const HomePage = () => {
  const [showImage, setShowImage] = React.useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 100); // 5000ms = 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const animation = prefersReducedMotion ? undefined : `${fadeIn} 5s ease-in-out`;

 return (
    <React.Fragment>
      <Flex flexDirection='column' alignItems={['flex-end', 'center']}>

        <Box w='100vw' h='100vh' position='relative' overflow='hidden'>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              zIndex: -1,
            }}
          >
            <source src={heraVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

{/*<<<<<<< HEAD
        <Stack direction={["column", "row"]}  zIndex='1' position='absolute' bottom={['25vh', '10vh']}>
         
=======*/}
          {showImage && (
            <Box
              as="img"
              src={heraText}
              alt="Hera Text"
              animation={animation}
              position="absolute"
              top="18%"
              left="40%"
              transform="translate(-50%, -50%)"
              maxW="70%"
              maxH="80%"
            />
          )}
        </Box>



        <Stack direction={["column", "row"]} zIndex='1' position='absolute' bottom={['25vh', '10vh']}>
{/*>>>>>>> 02a06a1 (Changed to nodej's 22)*/}
          <SocialButton label={'Twitter'} href={'https://twitter.com/HeraGalleria'} width='40px' height='40px' backgroundColor='white'>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={'Medium'} href={'https://medium.com/@HeraGalleria'} width='40px' height='40px' backgroundColor='white'>
            <FaMedium />
          </SocialButton>
          <SocialButton label={'Telegram'} href={'https://t.me/HeraGalleria'} width='40px' height='40px' backgroundColor='white'>
            <FaTelegram />
          </SocialButton>
          <SocialButton label={'Github'} href={'https://github.com/Jaredrsommer/HeraGalleriaFlex'} width='40px' height='40px' backgroundColor='white'>
            <FaGithub />
          </SocialButton>
          <SocialButton label={'Discord'} href={'https://discord.com/invite/IBC_GANG_BOI!'} width='40px' height='40px' backgroundColor='white'>
            <FaDiscord />
          </SocialButton>
        </Stack>
      </Flex>
    </React.Fragment>
  );
}
