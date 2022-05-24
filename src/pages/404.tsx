import { m } from 'framer-motion';
import React from 'react'
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minheight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

Page404.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="logoOnly">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="404 Página No Encontrada" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Lo sentimos, página no encontrada!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Lo sentimos, no encontramos la página que buscas. ¿Quizás hay un error en la URL?
            </Typography>
            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>
            <NextLink href="/">
              <Button size="large" variant="contained">
                Volver al Dashboard
              </Button>
            </NextLink>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
