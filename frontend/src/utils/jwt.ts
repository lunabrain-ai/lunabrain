/*
 * Copyright by LunaSec (owned by Refinery Labs, Inc)
 *
 * Licensed under the Business Source License v1.1
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 * https://github.com/lunasec-io/lunasec/blob/master/licenses/BSL-LunaTrace.txt
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import jwtDecode, { JwtPayload } from 'jwt-decode';

export const isTokenExpired = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return decoded.exp > currentTime;
};

export const handleTokenExpired = (exp: number | undefined) => {
  if (!exp) {
    console.log('expired');
    return;
  }

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  const expiredTimer = window.setTimeout(() => {
    console.log('expired');
  }, timeLeft);
  window.clearTimeout(expiredTimer);

  console.log(timeLeft);
};

export const setSession = (accessToken: string) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    // This function below will handle when token is expired
    const { exp } = jwtDecode<JwtPayload>(accessToken);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
  }
};