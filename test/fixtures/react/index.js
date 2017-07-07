import React from 'react';
import { render } from 'react-dom';

const HelloMessage = (props) => (<div>Hello {props.name}</div>);

render(
  <HelloMessage name="John" />,
  document.getElementById('root')
);