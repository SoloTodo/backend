import { m } from 'framer-motion';
import React from 'react'
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// layouts
import Layout from '../../layouts';
// components
import Page from '../Page';
import { varBounce } from '../animate';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minheight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

AccessDenied.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="logoOnly">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AccessDenied() {
  return (
    <Page title="403 Acceso denegado" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Acceso denegado
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary', pb: 2 }}>
              No cuentas con las credenciales necesarias
            </Typography>
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
