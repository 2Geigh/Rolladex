import dotenv from 'dotenv';
dotenv.config();

export const keystorePath = process.env.KEYSTORE_PATH;
export const keystorePassword = process.env.KEYSTORE_PASSWORD;
export const keyAlias = process.env.KEY_ALIAS;
export const keyAliasPassword = process.env.KEY_ALIAS_PASSWORD;

export const buildCommand_BASE = `npx cap build android --keystorepath ${keystorePath} --keystorepass ${keystorePassword} --keystorealias ${keyAlias} --keystorealiaspass ${keyAliasPassword}`;
