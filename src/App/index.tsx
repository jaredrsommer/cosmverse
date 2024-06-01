import * as React from "react"

import {
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom"

import {ChakraProvider,} from "@chakra-ui/react"
import {Navbar} from './components/navbar';

import {HomePage} from "./pages"
import {Gallery} from "./pages"
import {Create} from "./pages"
import {Account} from "./pages"
import { SdkProvider } from "./services/client/wallet"
import { config } from "../config";
import theme from "./theme"

export const App = () => (
  <ChakraProvider theme={theme}>
    <SdkProvider config={config}>

        <Router>
        <Navbar /> {/* This line includes the NavBar in your app */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/gallery" component={Gallery} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/account" component={Account} />
          {/* ... other routes */}
        </Switch>

          </Router>
    </SdkProvider>
  </ChakraProvider>
)
