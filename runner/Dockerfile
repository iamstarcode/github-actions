FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    ca-certificates curl gnupg git \
    build-essential python3 python3-pip \
    && apt-get clean

# Add Docker APT repo
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    sh -c 'echo "Types: deb\nURIs: https://download.docker.com/linux/ubuntu\nSuites: $(. /etc/os-release && echo $VERSION_CODENAME)\nComponents: stable\nSigned-By: /etc/apt/keyrings/docker.asc" > /etc/apt/sources.list.d/docker.sources'

RUN apt-get update && apt-get install -y \
    docker-ce docker-ce-cli containerd.io \
    && apt-get clean

# Create startup script
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo 'service docker start' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/bin/bash"]
