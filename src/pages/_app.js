// src/pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;