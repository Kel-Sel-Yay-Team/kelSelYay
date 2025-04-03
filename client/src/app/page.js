import Mapbox from "./component/Mapbox";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        {/* Meta tags begin here */}
        <title>Kel Sel Yay</title>
        <meta name="description" content="A live map to find missing people after the 2025 Myanmar Earthquake. Friends and families can safely and accurately report victims." />
        <meta name="keywords" content="Kel Sel Yay, Myanmar, Earthquake" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
		    <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32"></link>
        <link rel="canonical" href="https://kelselyay.com/" />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:title" content="Kel Sel Yay - Missing People Map" />
        <meta property="og:description" content="Live map to locate missing people after the 2025 Myanmar Earthquake. Reports are secure." />
    	  <meta property="og:url" content="https://kelselyay.com/" />
    	  <meta property="og:image" content="https://kelselyay.com/preview.png" />
    	  <meta property="og:type" content="website" />
        <meta name="twitter:card" content="Kel Sel Yay Map" />
		    <meta name="twitter:title" content="Kel Sel Yay - Missing People Map" />
		    <meta name="twitter:description" content="Live map to locate missing people after the 2025 Myanmar Earthquake. Reports are secure." />
		    <meta name="twitter:image" content="https://drive.google.com/file/d/1tV0cwKqImaBWlM6kILiIwmqjmappoLRy/view?usp=sharing" />
        {/* Meta tags begin here */}
      </Head>
      <Mapbox></Mapbox>
    </div>
  );
}
