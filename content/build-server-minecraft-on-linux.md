---
title: "Guide to Building a Minecraft Server on Linux – Simple and Professional"
date: "2024-11-20"
excerpt: "A detailed guide on how to set up a Minecraft server on Linux, tailored for both beginners and professionals"
featured: "https://tmdpc.vn/media/news/0206_CuhnhchiMinecrafttrnPCkhnglogitlag1.jpg"
---

Minecraft, one of the most popular sandbox games, allows players to unleash creativity, explore, and survive in an infinite world. Setting up your own Minecraft server to play with friends is an incredibly rewarding experience. This guide walks you through the process of creating a Minecraft server on Linux, from installation to configuration and connecting with friends.

![](https://tmdpc.vn/media/news/0206_CuhnhchiMinecrafttrnPCkhnglogitlag1.jpg)


## Why Choose Linux for Your Minecraft Server?
Linux is renowned for its stability, security, and resource optimization. It is the perfect environment for running a smooth Minecraft server, even on modest hardware. With Linux, you gain complete control over your server while leveraging a vast and supportive community.

![image](https://hackmd.io/_uploads/SygQ1w5f1l.png)

## System Requirements
Before you start, make sure you have:
- **Linux OS:** Ubuntu, CentOS, Debian, or any distribution you are comfortable with.
- **Root or sudo access.**
- **Stable internet connection.**
- **At least 1GB of dedicated RAM** (2GB or more is recommended for optimal performance).

## Step 1: Create a Directory for the Minecraft Server
First, create a new directory to store your Minecraft server files:

```bash
mkdir ~/minecraft-server
cd ~/minecraft-server
```

## Step 2: Download the Minecraft Server File
Download the latest Minecraft server file from Mojang using the `wget` command for quick and convenient updates:
```bash
wget https://piston-data.mojang.com/v1/objects/45810d238246d90e811d896f87b14695b7fb6839/server.jar
```

Note: The download link may change. Always verify the latest link on the official [Minecraft Server Download](https://www.minecraft.net/en-us/download/server).

![image](https://hackmd.io/_uploads/rkznKLcfyg.png)

## Step 3: Install or Update Java to the Latest Version
Minecraft servers require Java. Ensure you have Java 17 or newer installed. On Ubuntu, use the following commands:
```
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt update
sudo apt install openjdk-21-jdk
```

Check the Java version after installation:

```bash
java -version
```

## Step 4: Launch the Minecraft Server for the First Time

With Java installed and the server file downloaded, launch the server for the first time:

```bash
java -Xmx1024M -Xms1024M -jar server.jar nogui
```

This will generate an `eula.txt` file. Accept Mojang’s End User License Agreement by editing the file:
```bash
nano eula.txt
```
Change the line:
```bash
eula=false
``` 
to:
```bash
eula=true`
```
Save and exit (Ctrl + O, Enter, Ctrl + X).

![image](https://hackmd.io/_uploads/HkDw989G1x.png)

## Step 5: Configure Server Properties

Next, open the `server.properties` file to customize your server settings. Adjust parameters like world name, player limit, and gameplay settings. For instance, to allow non-Mojang accounts, set `online-mode` to `false`:

```bash
nano server.properties
```

![image](https://hackmd.io/_uploads/S1NIjI9zkl.png)

Key configurations:
- `online-mode=true`: Set to `false` to allow non-Mojang accounts.
- `max-players=20`: Set the maximum number of players.
- `level-name=world`: Name your Minecraft world.
- `difficulty=1`: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard).


Save and exit (Ctrl + O, Enter, Ctrl + X).

## Step 6: Start the Minecraft Server

Restart the server using the following command:

```bash
java -Xmx2G -Xms1G -jar server.jar nogui
```

Explanation:
- `Xmx2G`: Sets a maximum of 2GB RAM.
- `Xms1G`: Allocates a minimum of 1GB RAM.

By default, the server will run on port 25565 and is ready for players to join.

![image](https://hackmd.io/_uploads/HkjzhU9M1e.png)

## Step 7: Share the Server with Friends

### If You Have a Public IP
Share your server’s public IP with friends. Example: `103.123.120.32:25565`.

![image](https://hackmd.io/_uploads/B1lZYCIcGkg.png)

Example after a player joins:

![image](https://hackmd.io/_uploads/ByHSnLcz1x.png)

### If You Don’t Have a Public IP
Use [ngrok](https://ngrok.com/) to expose your server to the internet. Ngrok provides a temporary public address.

1. Install ngrok:
    ```bash
    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
    unzip ngrok-stable-linux-amd64.zip
    sudo mv ngrok /usr/local/bin
    ```

2. Run ngrok on port 25565:
    ```bash
    ngrok tcp 25565
    ```

![image](https://hackmd.io/_uploads/SkX4pUcMyl.png)

Ngrok will generate a URL like `0.tcp.jp.ngrok.io:13880`. Share this with friends. They can join your server by connecting to `0.tcp.jp.ngrok.io:13880` in Minecraft.
## Optimizing Your Minecraft Server
- `Plugins or Mods`: Use tools like Bukkit or Spigot to add plugins for better management and gameplay enhancements.
- `Resource Management`: Ensure your server doesn’t use excessive resources, especially on personal computers.
- `Security`: Use a firewall or tools like UFW to restrict access from unwanted IPs.


## Conclusion
Setting up and running a Minecraft server on Linux not only offers a unique gaming experience but also enhances your system administration skills. With your private server, you have complete control—from customizing gameplay to inviting friends into a boundless creative world.

Start today and enjoy building your very own Minecraft universe! 🌟
