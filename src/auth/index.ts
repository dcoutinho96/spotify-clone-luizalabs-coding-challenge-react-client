export * from './pkce';
export * from './login'
export * from './callback'

export const buildRedirectURL = () => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    return `${protocol}//${host}${port}/login`;
}