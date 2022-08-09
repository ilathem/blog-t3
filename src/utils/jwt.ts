/* JWT
https://jwt.io/
Basically a good way to decode data that is sent over the wire.
*/

import jwt from 'jsonwebtoken'

/* There are 2 ways to sign and verify jwt's:
1. Public/private tokens (more secure and more complicated)
2. String secret (what we  use in the tutorial)
 */

// secret is going to be used to sign and use the jwt
const SECRET = process.env.SECRET || 'changeme'


// takes in a generic object to 'sign', which encodes it with the secret string
export function signJwt(data: object) {
  return jwt.sign(data, SECRET);
}

/* we want this to return a context user 
We're using the generic type <T> so that when we use this function,
we can pass in what we want it to return
*/
export function verifyJwt<T>(token: string) {
  // return the type that we passed in, not just a generic object
  return jwt.verify(token, SECRET) as T;
}