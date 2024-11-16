---
title: "Kali Linux VPS for Free: A Segfault Tutorial That Makes It Possible"
date: "2024-11-05"
excerpt: "Kali Linux VPS for Free"
---

![image](https://hackmd.io/_uploads/Hk9g7yPWyg.png)


**Segfault**, created by The Hacker’s Choice, is a complimentary application for Cyber Security Researcher. It provides an unlimited server with Root access. With each new server that is generated, SSH connection is established for communal use.

![image](https://hackmd.io/_uploads/rkmIm1DZyl.png)


## Connecting to the Segfault Server
To log into Segfault, start by using the SSH command:
```
ssh root@segfault.net # The password is 'segfault'
```

When initially connecting to Segfault to open a root and SSH server, a 60-second wait is required. However, this duration is not typical for subsequent connections (probably less).

![image](https://hackmd.io/_uploads/rytLmkwZyl.png)



Once successfully connected to the server, it will provide details such as SSH and IP address. (It’s important to save this information for future reference.)

![image](https://hackmd.io/_uploads/B1qPm1vWJe.png)



Later, to log in again, simply execute the SSH command provided below.

![image](https://hackmd.io/_uploads/ByWOQyPZJg.png)

```
ssh -o "SetEnv SECRET=YOUR_KEY_PRIVATE" root@lulz.segfault.net
```

Once logged in, this Kali server can be utilized as a virtual machine equipped with a comprehensive suite of tools for security and networking, … ([Segfault’s homepage](https://www.thc.org/segfault/) for more details).

![image](https://hackmd.io/_uploads/H1HtXkvb1g.png)


To log out of the server, simply use the exit command.

![image](https://hackmd.io/_uploads/r1jtmyvZ1l.png)


## TUNNEL SERVER
Although the server we have is nearly identical to a real Kali Linux virtual machine, it can initiate connections from the inside, but external connections cannot reach it using common protocols like HTTP, TCP, etc. For this, I will need to utilize a powerful Cloudflare feature called Tunnel.

### Argo Tunnel (Cloudflare Tunnel)
Initially, you must establish a tunnel from Cloudflare to the Kali Linux server using [Zero Trust](https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/).

### Create a tunnel

![image](https://hackmd.io/_uploads/BkPqmJP-1g.png)

### Name your tunnel

![image](https://hackmd.io/_uploads/HJSoQyDZ1l.png)


### Install and run connectors
In the `Choose your environment` options, select Debian — 64-bit.

![image](https://hackmd.io/_uploads/rk8pQyD-yl.png)


![image](https://hackmd.io/_uploads/rJe0XJwb1l.png)

```
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

sudo dpkg -i cloudflared.deb 

sudo cloudflared service install "YOUR_TOKEN_CLOUDFLARE" # Replace YOUR_TOKEN_CLOUDFLARE
```

Upon a successful connection, Connectors will display both ID and Status.

![image](https://hackmd.io/_uploads/HJok4kPbyx.png)

_You should delete the old Cloudflare version on Segfault to install the new version (like the other version is being warned)_

### Route Traffic

![image](https://hackmd.io/_uploads/rJ_lN1wZyl.png)

In `Route Traffic`, you must fill in the **Domain** (at least one domain is required) and the method + URL (localhost).

Use `http.server` in background to tunnel from machine to cloudflare

![image](https://hackmd.io/_uploads/S1lz41vW1l.png)

When the http.server is running in the background, a Cloudflare tunnel can be configured to a domain

![image](https://hackmd.io/_uploads/Byvz41vbJl.png)

You can create an HTML file in the background to display a welcome page. :>

### UPTIME Server

However, if the requirement is to establish a connection that remains active indefinitely, allowing applications to run continuously, what should be done?

![image](https://hackmd.io/_uploads/ByaMVkDWkx.png)

According to the segfault announcement, the server will remain up as long as you are logged into the Segfault. This means your progress will be preserved as long as you maintain an SSH connection to segfault.net.

So we need to make something that can automatically connect “ssh” to the segfault server.

### GITHUB ACTIONS

[GitHub Actions](https://docs.github.com/en/actions) is a complimentary service offered by GitHub that facilitates the automation of the CI/CD process. It enables users to create workflows that automate tasks within the software development lifecycle.

When you create a repository in Github, you can choose Actions to start Github Actions, choose the simple workflow.

![image](https://hackmd.io/_uploads/HkC4N1D-Je.png)

![image](https://hackmd.io/_uploads/rJtB4kwb1g.png)

I have created a YAML script to automate the process of repeatedly establishing an SSH connection with a set interval.

```yaml
name: SEGFAULT

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '*/20 * * * *' # Restart each 20 minutes

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install sshpass
        run: sudo apt-get install -y sshpass

      - name: Connect to SSH and run command
        # automatic connect ssh from github actions
        run: |
          sshpass -p "segfault" ssh -o "SetEnv SECRET=YOUR_KEY" -o "StrictHostKeyChecking=no" root@lulz.segfault.net "ls"
```

This workflow keeps the server connection alive by reconnecting every 20 minutes, ensuring your server remains active.

![Automation Complete](https://hackmd.io/_uploads/r1484kP-yl.png)

We have successfully established a continuous SSH connection to the server, ensuring it remains active for our needs.


## Conclusion
By following these steps, you can set up a reliable, free Kali Linux environment using Segfault, create secure outbound tunnels, and maintain uptime indefinitely. Share this guide if it’s helpful!


![image](https://hackmd.io/_uploads/Hk9g7yPWyg.png)


**Segfault**, created by The Hacker’s Choice, is a complimentary application for Cyber Security Researcher. It provides an unlimited server with Root access. With each new server that is generated, SSH connection is established for communal use.

![image](https://hackmd.io/_uploads/rkmIm1DZyl.png)


## Connecting to the Segfault Server
To log into Segfault, start by using the SSH command:
```
ssh root@segfault.net # The password is 'segfault'
```

When initially connecting to Segfault to open a root and SSH server, a 60-second wait is required. However, this duration is not typical for subsequent connections (probably less).

![image](https://hackmd.io/_uploads/rytLmkwZyl.png)



Once successfully connected to the server, it will provide details such as SSH and IP address. (It’s important to save this information for future reference.)

![image](https://hackmd.io/_uploads/B1qPm1vWJe.png)



Later, to log in again, simply execute the SSH command provided below.

![image](https://hackmd.io/_uploads/ByWOQyPZJg.png)

```
ssh -o "SetEnv SECRET=YOUR_KEY_PRIVATE" root@lulz.segfault.net
```

Once logged in, this Kali server can be utilized as a virtual machine equipped with a comprehensive suite of tools for security and networking, … ([Segfault’s homepage](https://www.thc.org/segfault/) for more details).

![image](https://hackmd.io/_uploads/H1HtXkvb1g.png)


To log out of the server, simply use the exit command.

![image](https://hackmd.io/_uploads/r1jtmyvZ1l.png)


## TUNNEL SERVER
Although the server we have is nearly identical to a real Kali Linux virtual machine, it can initiate connections from the inside, but external connections cannot reach it using common protocols like HTTP, TCP, etc. For this, I will need to utilize a powerful Cloudflare feature called Tunnel.

### Argo Tunnel (Cloudflare Tunnel)
Initially, you must establish a tunnel from Cloudflare to the Kali Linux server using [Zero Trust](https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/).

### Create a tunnel

![image](https://hackmd.io/_uploads/BkPqmJP-1g.png)

### Name your tunnel

![image](https://hackmd.io/_uploads/HJSoQyDZ1l.png)


### Install and run connectors
In the `Choose your environment` options, select Debian — 64-bit.

![image](https://hackmd.io/_uploads/rk8pQyD-yl.png)


![image](https://hackmd.io/_uploads/rJe0XJwb1l.png)

```
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

sudo dpkg -i cloudflared.deb 

sudo cloudflared service install "YOUR_TOKEN_CLOUDFLARE" # Replace YOUR_TOKEN_CLOUDFLARE
```

Upon a successful connection, Connectors will display both ID and Status.

![image](https://hackmd.io/_uploads/HJok4kPbyx.png)

_You should delete the old Cloudflare version on Segfault to install the new version (like the other version is being warned)_

### Route Traffic

![image](https://hackmd.io/_uploads/rJ_lN1wZyl.png)

In `Route Traffic`, you must fill in the **Domain** (at least one domain is required) and the method + URL (localhost).

Use `http.server` in background to tunnel from machine to cloudflare

![image](https://hackmd.io/_uploads/S1lz41vW1l.png)

When the http.server is running in the background, a Cloudflare tunnel can be configured to a domain

![image](https://hackmd.io/_uploads/Byvz41vbJl.png)

You can create an HTML file in the background to display a welcome page. :>

### UPTIME Server

However, if the requirement is to establish a connection that remains active indefinitely, allowing applications to run continuously, what should be done?

![image](https://hackmd.io/_uploads/ByaMVkDWkx.png)

According to the segfault announcement, the server will remain up as long as you are logged into the Segfault. This means your progress will be preserved as long as you maintain an SSH connection to segfault.net.

So we need to make something that can automatically connect “ssh” to the segfault server.

### GITHUB ACTIONS

[GitHub Actions](https://docs.github.com/en/actions) is a complimentary service offered by GitHub that facilitates the automation of the CI/CD process. It enables users to create workflows that automate tasks within the software development lifecycle.

When you create a repository in Github, you can choose Actions to start Github Actions, choose the simple workflow.

![image](https://hackmd.io/_uploads/HkC4N1D-Je.png)

![image](https://hackmd.io/_uploads/rJtB4kwb1g.png)

I have created a YAML script to automate the process of repeatedly establishing an SSH connection with a set interval.

```yaml
name: SEGFAULT

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '*/20 * * * *' # Restart each 20 minutes

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install sshpass
        run: sudo apt-get install -y sshpass

      - name: Connect to SSH and run command
        # automatic connect ssh from github actions
        run: |
          sshpass -p "segfault" ssh -o "SetEnv SECRET=YOUR_KEY" -o "StrictHostKeyChecking=no" root@lulz.segfault.net "ls"
```

This workflow keeps the server connection alive by reconnecting every 20 minutes, ensuring your server remains active.

![Automation Complete](https://hackmd.io/_uploads/r1484kP-yl.png)

We have successfully established a continuous SSH connection to the server, ensuring it remains active for our needs.


## Conclusion
By following these steps, you can set up a reliable, free Kali Linux environment using Segfault, create secure outbound tunnels, and maintain uptime indefinitely. Share this guide if it’s helpful!
