import * as React from 'react';

export const isMountedRef = React.createRef();

export const navigationRef = React.createRef();

export function navigateGoBack() {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.goBack();
  }
}

export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
  }
}

export function navigateReset(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.dispatch(
      navigationRef.current.reset({
        index: 0,
        routes: [{ name }],
        actions: [navigationRef.current.navigate(name, params)]
      })
    );
  } else {
  }
}