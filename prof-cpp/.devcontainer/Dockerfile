# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.194.0/containers/cpp/.devcontainer/base.Dockerfile

ARG VARIANT="buster"
FROM mcr.microsoft.com/vscode/devcontainers/cpp:0-${VARIANT}

# [Optional] Uncomment this section to install additional packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # linter for c++
    clang-tidy

# make clang default c++ compiler for cmake
# (it will choose clang instead of gcc when generating build scripts)
ENV CC=/usr/bin/clang
ENV CXX=/usr/bin/clang++

# fix "unsafe repository" git error
RUN git config --global --add safe.directory /workspaces/prof