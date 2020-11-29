import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../NavBar';
import { Masthead } from './Masthead';
import { Features } from './Features';
import { PageWrapper } from 'app/components/PageWrapper';
import { ActivityMap } from '../ActivityMap';

export function HomePage() {
  return (
    <>
      <ActivityMap />
      {/* <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React Boilerplate application homepage"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Masthead />
        <Features />
      </PageWrapper> */}
    </>
  );
}
