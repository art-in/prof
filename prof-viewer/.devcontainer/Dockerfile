FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-18

# hide "new version of npm available" notification from CLI
RUN npm config set update-notifier false

# install global node modules
RUN npm install -g serve@13.0.2