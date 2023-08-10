import React from "react";
import "./App.css";
import Chat from "./Chat";
import { SiRobotframework } from "react-icons/si";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {

  const navigate = useNavigate()

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route
          path="/"
          element={
            <Home/>
          }
        />
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />

        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />

        <Route
          path="/protected"
          element={
            <>
              <SignedIn>
              <div className="App todo-app">
              <header className="App-header">
                  <div style={{display:"flex", justifyContent: "space-between"}}>
                <h1 className="Heading">
                    <span className="span-logo">
                      <SiRobotframework />
                    </span>
                    <span className="span-heading">AI Todo Creator</span>
                </h1>
                    <div style={{marginRight: "30px"}}><UserButton/></div>
                  </div>
                  {/* <div>Hello, {user.firstName}</div> */}
              </header>
              <main className="App-main">
                <Chat />
              </main>
            </div>
              </SignedIn>

              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;
