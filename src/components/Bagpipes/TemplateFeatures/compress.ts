//import * as zlib from 'zlib';
//var URLSafeBase64 = require('urlsafe-base64');
import * as pako from 'pako';


export function compressString(input: string): string {
  try {
    const utf8encoded = new TextEncoder().encode(input);
    const compressed = pako.deflate(utf8encoded);
    const base64encoded = btoa(String.fromCharCode.apply(null, compressed));

    console.log('Base64 Encoded:', base64encoded);

    return base64encoded;
  } catch (error) {
    console.error('Error compressing string:', error);
    return ''; // Return an empty string or handle the error as needed
  }
}

function addPadding(base64String: string): string {
  while (base64String.length % 4 !== 0) {
    base64String += '=';
  }
  return base64String;
}

  export function decompressString(compressedInput: string): string {
    try {
      const in2 = addPadding(compressedInput);
      // Ensure that the base64 string is properly formatted
      const formattedInput = in2.replace(/[^A-Za-z0-9+/]/g, '');
  
      console.log('Formatted Input:', formattedInput);
  
      const uint8Array = new Uint8Array(
        atob(formattedInput)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
  
      const decompressed = pako.inflate(uint8Array, { to: 'string' });
      return decompressed;
    } catch (error) {
      console.error('Error decoding base64 string:', error);
      return ''; // Return an empty string or handle the error as needed
    }
  }