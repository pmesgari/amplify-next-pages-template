import "@/styles/app.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import 'bulma/css/bulma.min.css';

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
