/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, useHistory } from 'react-router-dom';
import { ModalSwitch, ModalRoute } from 'react-router-modal-gallery';

import { GlobalStyle } from '../styles/global-styles';
import { DialogWindow } from './containers/DialogWindow';

import { HomePage } from './containers/HomePage/Loadable';
import { NotFoundPage } from './containers/NotFoundPage/Loadable';

export function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);
  return shouldRender;
}

export function ControledModal(props) {
  const history = useHistory();
  const [isMounted, setIsMounted] = useState(true);
  const shouldRenderChild = useDelayUnmount(isMounted, 250);

  useEffect(() => {
    console.log(shouldRenderChild, isMounted);
    if (!shouldRenderChild && !isMounted) {
      history.push('/');
    }
  }, [shouldRenderChild]);

  return (
    <>
      {shouldRenderChild && (
        <DialogWindow
          onClose={() => {
            setIsMounted(false);
          }}
          classState={isMounted ? 'visible' : 'hidden'}
        />
      )}
    </>
  );
}

export function App() {
  const [red, green, blue] = [69, 111, 225];

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - mass mobilization"
        defaultTitle="Mass Mobilization"
      >
        <meta name="description" content="Mass mobilization" />
      </Helmet>

      <Switch>
        <Route component={HomePage} />
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
      <Route
        exact
        path={process.env.PUBLIC_URL + '/:id'}
        component={ControledModal}
      />
      <GlobalStyle />
    </BrowserRouter>
  );
}
