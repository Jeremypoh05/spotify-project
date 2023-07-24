import { Price } from '@/types'

//responsible for determining the URL of the website depending on the environment it is running in
export const getURL = () => {
  let url =
    /*
   initializing a variable url with a default value of 'http://localhost:3000/'. 
   This is the URL that will be used when the environment variables NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_VERCEL_URL 
   are not set. It assumes that the website is running locally on port 3000.
   */
    // The ?? operator is used to provide fallback values if the variables are not defined.
    /*If the NEXT_PUBLIC_SITE_URL is defined, it will take precedence as the url value. If not, it will check for the NEXT_PUBLIC_VERCEL_URL, which is an environment variable automatically set by Vercel when the website is deployed on their platform.

If none of the above environment variables are defined, 
the function will fall back to the default value of 'http://localhost:3000/'.
*/
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  /*
  if the url contains the substring 'http', which would indicate that the URL already includes the https:// protocol. 
  If it does not contain 'http', the function prefixes the url with 'https://'.
  */
  url = url.includes('http') ? url : `https://${url}`
  /*
    ensures that the url ends with a trailing / by checking the last character. 
    If the last character is not /, it adds a trailing slash to the url
  */
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const postData = async ({
  url,
  data,
}: {
  url: string
  data?: { price: Price }
}) => {
  console.log('posting,', url, data)

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.log('Error in postData', { url, data, res })

    throw Error(res.statusText)
  }

  return res.json()
}

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z') // Unix epoch start.
  t.setSeconds(secs)
  return t
}
