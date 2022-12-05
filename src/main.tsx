import './index.css';
import App from './App';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';


export function initFacebookSdk() {
  return new Promise(resolve => {
      // @ts-ignore
      window.fbAsyncInit = function () {window.FB.init({appId: import.meta.env.VITE_APP_ID,
              cookie: true,
              xfbml: true,
              version: 'v15.0'
          });
      };

      (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement('script'); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        if(fjs.parentNode) {
          fjs.parentNode.insertBefore(js, fjs);
        }
      }(document, 'script', 'facebook-jssdk'));
  });
}

initFacebookSdk();

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BASE_URL
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
)
