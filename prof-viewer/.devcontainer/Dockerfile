FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-18

# additional packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # for canvas npm package
    build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# hide "new version of npm available" notification from CLI
RUN npm config set update-notifier false

# install global node modules
RUN npm install -g serve@13.0.2