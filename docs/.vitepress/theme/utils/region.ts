/** Site hostname for the current region, used in Vue components at runtime */
export const siteHostname: string =
  typeof import.meta.env?.VITE_SITE_HOSTNAME === 'string'
    ? import.meta.env.VITE_SITE_HOSTNAME
    : 'https://open.longbridge.com'
