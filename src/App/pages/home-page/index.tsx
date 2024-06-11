import './homepage.css';

import * as React from 'react';

import { Box, Flex, Stack } from '@chakra-ui/react';
import { FaDiscord, FaGithub, FaMedium, FaTelegram, FaTwitter } from 'react-icons/fa';

import { SocialButton } from '../../components';
import  heraHomepage  from '../../assets/hera_bg2.jpeg';

export const HomePage = () => {
  return (
    <React.Fragment>

      <Flex flexDirection='column' alignItems={['flex-end', 'center']}>

      <Box w='100vw' h='100vh' backgroundImage={heraHomepage} zIndex='-1' position='relative' backgroundSize='cover'>
      </Box>

        <Stack direction={["column", "row"]}  zIndex='1' position='absolute' bottom={['25vh', '10vh']}>
         
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
>>>>>>> a079383 (Adding Initial Branding)
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
