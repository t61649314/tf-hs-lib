const NodeRSA = require("node-rsa");
const crypto = require('crypto');

const serverPubKey = new NodeRSA(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCD8P37Bn1olf4FeRLW5hkU5/mL
lK8cXTS9behsjgOzNcS3Xt7671ZWrpeWgUA611r7hAqeKCqeb5aTvnFf3va7fa3B
P9WWdvWhen3CyvuDead+L03dRQWtxWqi1lcHQMFDLVC50mWXZ56MK3byfkBNUqiN
VDyOlRbElY18MYGM9QIDAQAB
-----END PUBLIC KEY-----`);
const webPriKey = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCyVqHxtuJvsRmm+ey9v2VZUfNmYmfNdn0UASpeO2JzXMha42Q5
r282zrjjcNFVgtaYAFtqBlguOT1RVAE3U5XuX5MnM9Y1uLGpCMCB/JkEPWgCOwpx
NqPM1TbGWNQhT9s34VIjmuaI8yVhaZ43o/bKY0ijR+yuvq1+uOspsTp9rwIDAQAB
AoGAdigZ4ckW24OOCGhcJxeRMY2vYy1dsu6HTmK7THWx89cMU9OGywVl/P0X2HEd
8LbgMRNDfcq4T9/StXif2aVClvBKiDTNpoF9yAgOsBp34aAnAe5TtGcipn+/1Y2Y
O5gbBRhKO0gvWtk6N4fq0/xzAueNLB7KBK5Z8MSuRII5gjkCQQDyfQ4DIW0ggexL
OyXXesnA64Bg2ehbGMhdSYIbzfFg6Qu+csPRPSKYC4cPiuPvNxiQDdvDbo7rzHF5
2rXhKS0bAkEAvEaEcy6JAgCA0paRmFbPP32uFJJUSTc6n+Xsrwmooqg1d6bXmtt9
c7ioIwfQKHoOwzvjw67C+BtxVEVoM3te/QJBAOYawWc7GwEUCRTCxgAaZsWJNMOz
RIjdlZTgonScEwfxXdGVujgeGWvK1JltJSrlT4uzeu2TRlCAKtaFMr69gi0CQAjB
ntdcirK1I0ioCA11vB3P0pDSXWkqUGevYdqiMF2gRRxTfiONocAIDonSizPWuWkL
GAS51AeF/zdUIwyB6GECQEejU19rg8rMLB3qs1o5aEuXd9YIc1QuVh5Od1GlEoR8
bWRVfGPaBT8NEp7Y6B3R9dJP0IxvhlXc4UGWnCVyRuU=
-----END RSA PRIVATE KEY-----`);
// const webPubKey = new NodeRSA(`-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCyVqHxtuJvsRmm+ey9v2VZUfNm
// YmfNdn0UASpeO2JzXMha42Q5r282zrjjcNFVgtaYAFtqBlguOT1RVAE3U5XuX5Mn
// M9Y1uLGpCMCB/JkEPWgCOwpxNqPM1TbGWNQhT9s34VIjmuaI8yVhaZ43o/bKY0ij
// R+yuvq1+uOspsTp9rwIDAQAB
// -----END PUBLIC KEY-----`)


class Encrypt {

  static AESEncrypt(data) {
    data = JSON.stringify(data);
    let iv = "";
    let key = random(32);
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-256-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return {
      key: key,
      encryp: cipherChunks.join('')
    };
  }

  static AESDecrypt(encryp, key) {
    if (!encryp) {
      return null;
    }
    let iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(encryp, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
  }

  static RSAPublickEncrypt(data) {
    const encrypted = serverPubKey.encrypt(data, 'base64');
    return encrypted;
  }

  static RSAPrivateDecrypt(encryp) {
    const data = webPriKey.decrypt(encryp, 'utf8');
    return data
  }

  static encryptResp(data) {
    let aesEncrypt = this.AESEncrypt(data);
    let encrypAesKey = this.RSAPublickEncrypt(aesEncrypt.key);
    return {
      key: encrypAesKey,
      body: aesEncrypt.encryp
    }
  }

  static decryptResp(encryptKey, encryptBody) {
    let aeskey = this.RSAPrivateDecrypt(encryptKey);
    let body = this.AESDecrypt(encryptBody, aeskey);
    return body
  }

  static signReq(data, timestamp) {
    var params = [];
    Object.keys(data).sort().map(key => {
      if (data[key]) {
        params.push(`${key}=${encodeURIComponent(data[key])}`);
      }
    })
    params.push(`timestamp=${timestamp}`);
    let paramsStr = params.join('&');
    return webPriKey.sign(paramsStr, 'base64', 'utf8');
  }

  static verifySign(data, timestamp, encryptSign) {
    var params = [];
    Object.keys(data).sort().map(key => {
      if (data[key]) {
        params.push(`${key}=${encodeURIComponent(data[key])}`);
      }
    })
    params.push(`timestamp=${timestamp}`);
    let paramsStr = params.join('&');
    console.log(paramsStr);
    var result = webPubKey.verify(Buffer.from(paramsStr), encryptSign, 'Buffer', 'BASE64');
    console.log(result);
  }

}

let res = {
  "key": "fqv8HqyeK/Tq7Gu5PdVt913J5rmd15Aiou+3v7DtnAP7h7WSIJpvJIjXiJBhiDxKsgHH55P7+/FVtJv0t8CnWWEKI+yhhlyMhEFN+GIqEiEJUedZrgBh6fYRTVfaiem4pzkoJWvav+oqU81FXis3M5j8o0+lHMDgbgqZP8FqMn0=",
  "body": "pQzOzuALyWoOBQDY0BfwLoHEJDK8kA4fvf1hgVEjlGbpj/lTnPnlqOqSOrPk7auO8chsbi/yFrG/kzPL4wbfSkShv18/RRD1b0I4Ta9PKRwY67matKdkCxWFA8eSv5YkSh8y2A6kAjVI2mITWKI0XtPlg86/33e9uMPZxe73KNk68tXAOA2sbrWQgRrPmvDSOxHyVq9g4fjCq5lti9vcMeA/XtXXGE0YCXcdDGdEY0DDi8rKUopnP/q72iGAXpYqviDPRDTiM5JyDM9MI4g0iFAxHVZlLcuL0siCOs1/WgN9QecI+20iesHgEAWcSUCKVcyJnpjWKHpdLS0zf0KeIA=="
}

let a = Encrypt.decryptResp(res.key, res.body);

let data = {
  AA2: "123&",
  AA1: "123",
  AA4: "123",
  AA3: "123",
  AA5: "",
}
let timestamp = 1583996208857;
let host = 'cdp_portal'
let sign = Encrypt.signReq(data, timestamp);
console.log(sign)
// Encrypt.verifySign(data, timestamp, sign);
