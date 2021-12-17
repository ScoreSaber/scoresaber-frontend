/// <reference types="@sveltejs/kit" />
interface Window {
   adsbygoogle: { [key: string]: unknown }[];
   canRunAds: boolean | undefined;
   cf: any;
}
interface HTMLScriptElement {
   readyState: any;
   onreadystatechange: any;
}
