import { useEffect } from 'react';

const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = "text/babel";
    script.src = url;
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
    console.log("W środku skryptu", script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};

export default useScript;