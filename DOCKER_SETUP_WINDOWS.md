# Docker Desktop Setup Guide for Windows

## Current Status

✅ WSL 2 has been successfully installed on your system
⚠️ **System reboot required** for changes to take effect

## Next Steps

### 1. Reboot Your Computer
The installation message states: "Changes will not be effective until the system is rebooted."

**Please restart your Windows machine now.**

### 2. After Reboot - Verify WSL 2 Installation

Once your computer restarts, verify WSL 2 is working:

```powershell
# Check WSL status
wsl --status

# Should show: "Default Version: 2" or similar
```

### 3. Install a Linux Distribution (Required)

WSL 2 needs a Linux distribution to function. Docker Desktop will prompt you, but you can install one manually:

```powershell
# List available distributions
wsl --list --online

# Install Ubuntu (recommended)
wsl --install -d Ubuntu

# Or install Debian
wsl --install -d Debian
```

During installation, you'll be prompted to create a username and password for the Linux distribution.

### 4. Set WSL 2 as Default (if needed)

```powershell
wsl --set-default-version 2
```

### 5. Configure Docker Desktop

1. **Start Docker Desktop** after reboot
2. Docker Desktop will detect WSL 2 automatically
3. If prompted, go to **Settings → General → Use the WSL 2 based engine** (should be enabled by default)
4. In **Settings → Resources → WSL Integration**, ensure your installed Linux distribution is enabled

### 6. Verify Docker is Working

```powershell
# Check Docker version
docker --version

# Check Docker info (should work without errors)
docker info

# Test with a simple container
docker run hello-world
```

### 7. Start Your Application

Once Docker Desktop is running successfully:

```powershell
cd C:\Sheeba\Cursor\smn
docker-compose up -d
```

## Troubleshooting

### If Docker Desktop Still Shows Virtualization Error After Reboot

1. **Enable Hyper-V** (if not already enabled):
   ```powershell
   # Run PowerShell as Administrator
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   ```
   Then reboot again.

2. **Check BIOS Settings**:
   - Restart and enter BIOS/UEFI settings (usually F2, F10, F12, or Del during boot)
   - Enable **Intel VT-x** (Virtualization Technology) or **AMD-V**
   - Enable **Hyper-V** or **Virtualization**
   - Save and exit

3. **Verify Virtualization in Windows**:
   ```powershell
   # Check if Hyper-V is enabled
   Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V
   
   # Check virtualization support
   systeminfo | findstr /C:"Hyper-V"
   ```

### Alternative: Use Hyper-V Instead of WSL 2

If WSL 2 doesn't work, you can configure Docker Desktop to use Hyper-V:

1. Enable Hyper-V (requires Windows Pro, Enterprise, or Education):
   ```powershell
   # Run as Administrator
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   ```

2. Restart your computer

3. Docker Desktop should automatically detect Hyper-V

### Check System Requirements

- **Windows 10 64-bit**: Pro, Enterprise, or Education (Build 19041 or higher)
- **Windows 11 64-bit**: Home or Pro version 21H2 or higher
- **Virtualization**: Enabled in BIOS
- **Hyper-V and Containers Windows features**: Must be enabled
- **WSL 2**: Installed and updated (preferred) OR Hyper-V enabled

### Verify WSL 2 Installation Details

```powershell
# Check WSL version
wsl --version

# List installed distributions
wsl --list --verbose

# Check WSL status
wsl --status
```

## Summary

1. ✅ WSL 2 installed
2. ⚠️ **REBOOT REQUIRED** ← Do this now!
3. After reboot: Install Linux distribution (Ubuntu/Debian)
4. Start Docker Desktop
5. Run `docker-compose up -d`

## Still Having Issues?

If you continue to experience virtualization errors after following all steps:

1. Ensure you're running Windows 10/11 64-bit (not 32-bit)
2. Verify your Windows edition supports virtualization (Pro, Enterprise, Education, or Home with WSL 2)
3. Check if your antivirus/security software is blocking virtualization
4. Update your BIOS/UEFI firmware
5. Ensure Windows features are enabled: `OptionalFeatures.exe` → Virtual Machine Platform, Windows Subsystem for Linux, Hyper-V (if available)

