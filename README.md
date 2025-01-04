# Wiener Linien Display

A real-time departure board for Vienna public transport, designed for Raspberry Pi kiosk displays.

## Features
- Real-time departure information
- Auto-refresh every 30 seconds
- Dark theme for better visibility
- Fullscreen kiosk mode

## Development Setup

1. Clone and install dependencies:
```bash
git clone https://github.com/paulpaul168/wiener-display.git
cd wiener-display
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Raspberry Pi Installation

1. Install required packages:
```bash
sudo apt update
sudo apt install -y nodejs npm chromium-browser
```

2. Clone and build the application:
```bash
git clone https://github.com/paulpaul168/wiener-display.git
cd wiener-display
npm install
npm run build
```

3. Create startup script:
```bash
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/wiener-display.desktop << EOL
[Desktop Entry]
Type=Application
Name=Wiener Display
Exec=chromium-browser --kiosk --disable-restore-session-state http://localhost:3000
X-GNOME-Autostart-enabled=true
EOL
```

4. Create service for the Next.js server:
```bash
sudo tee /etc/systemd/system/wiener-display.service << EOL
[Unit]
Description=Wiener Display Next.js Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/wiener-display
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOL
```

5. Enable and start:
```bash
sudo systemctl enable wiener-display
sudo systemctl start wiener-display
```

6. Configure auto-login:
   - Run: `sudo raspi-config`
   - Go to: System Options → Boot / Auto Login
   - Select: Desktop Autologin

7. Reboot:
```bash
sudo reboot
```

## Troubleshooting

Check if server is running:
```bash
sudo systemctl status wiener-display
```

## Ansible Deployment

For automated deployment, you can use the provided Ansible playbook:

1. Install Ansible on your control machine:
```bash
sudo apt install ansible
```

2. Add your Raspberry Pi's IP to the inventory:
```bash
echo "raspberry.local ansible_user=pi" > inventory.ini
```

3. Run the playbook:
```bash
ansible-playbook -i inventory.ini deploy.yml
```

    