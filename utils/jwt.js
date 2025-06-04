import { decode as atob } from 'base-64';

export const parseJwt=(token) =>{
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse JWT:', err);
    return null;
  }
}

// const decoded = parseJwt(token);
//       if (!decoded){
//         Alert.alert('Login failed','invalid token received');
//       }
//       const { role_name, user_id } = decoded;
