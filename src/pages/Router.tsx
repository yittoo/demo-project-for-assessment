import {
  Switch,
  BrowserRouter,
  Route,
  BrowserRouterProps,
} from "react-router-dom";

import Index from "./";

const Router = (): React.ReactElement<BrowserRouterProps, any> => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Index} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
