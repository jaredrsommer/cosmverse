import './homepage.css';

import * as React from 'react';

import { Box, Flex, Stack } from '@chakra-ui/react';
import { FaDiscord, FaGithub, FaMedium, FaTelegram, FaTwitter } from 'react-icons/fa';

import { SocialButton } from '../../components';
import  cosmverseHomepage  from '../../assets/homepage.png';


export const HomePage = () => {
  return (
    <React.Fragment>


      <Flex flexDirection='column' alignItems={['flex-end', 'center']}>

      <Box w='100vw' h='100vh' backgroundImage={cosmverseHomepage} zIndex='-1' position='relative' backgroundSize='cover'>
      </Box>





        <Stack direction={["column", "row"]}  zIndex='1' position='absolute' bottom={['25vh', '10vh']}>
         
          <SocialButton label={'Twitter'} href={'https://twitter.com/Event__16'} width='40px' height='40px' backgroundColor='white'>
            <FaTwitter />
          </SocialButton>

          <SocialButton label={'Medium'} href={'https://medium.com/@event_16'} width='40px' height='40px' backgroundColor='white'>
            <FaMedium />
          </SocialButton>
          <SocialButton label={'Telegram'} href={'https://t.me/event_16'} width='40px' height='40px' backgroundColor='white'>
              <FaTelegram />
          </SocialButton>
          <SocialButton label={'Github'} href={'https://github.com/Jaredrsommer/cosmverse'} width='40px' height='40px' backgroundColor='white'>
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
