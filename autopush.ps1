<#
.SYNOPSIS
    PhotonX Automatic Git Sync & Push Daemon for Windows
.DESCRIPTION
    Monitors the repository for file modifications, additions, and deletions.
    Automatically stages, commits, and pushes changes to GitHub with debouncing.
.PARAMETER IntervalSeconds
    Interval in seconds between checks. Default is 5 seconds.
.PARAMETER Once
    Runs a single sync cycle and exits immediately.
.PARAMETER Message
    Custom commit message. If not supplied, an auto-generated timestamped message is used.
.EXAMPLE
    .\autopush.ps1
    Runs the automated continuous watcher (pushes automatically whenever you save).
.EXAMPLE
    .\autopush.ps1 -Once -Message "feat: add new spectral filter"
#>

[CmdletBinding()]
param(
    [int]$IntervalSeconds = 5,
    [switch]$Once,
    [string]$Message = ""
)

$ErrorActionPreference = "Continue"

# Navigate to the repository root where this script resides
$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

function Write-HostColor($msg, $color = "Cyan") {
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$timestamp] $msg" -ForegroundColor $color
}

Write-HostColor "=== PhotonX Automated Git Auto-Push Daemon Initialized ===" "Cyan"
Write-HostColor "Target Repository: https://github.com/Mazonia/photonx.git" "DarkCyan"
Write-HostColor "Monitoring folder: $RepoRoot" "DarkGray"

function Sync-GitRepo {
    param([string]$customMsg)

    # Check for changes (untracked, modified, deleted)
    $status = git status --porcelain
    if (-not $status) {
        return $false
    }

    Write-HostColor "Detected local changes in working tree:" "Yellow"
    $status | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }

    # Debounce brief pause in case multi-file edits are still writing
    Start-Sleep -Seconds 2

    # Stage all changes
    git add -A

    # Re-verify something is staged
    $staged = git diff --cached --name-only
    if (-not $staged) {
        Write-HostColor "No staged changes to commit." "DarkGray"
        return $false
    }

    # Generate commit message if not provided
    if (-not $customMsg) {
        $changedCount = ($staged | Measure-Object).Count
        $sampleFiles = ($staged | Select-Object -First 3) -join ", "
        if ($changedCount -gt 3) {
            $sampleFiles += " (+$($changedCount - 3) more)"
        }
        $timeStr = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        $commitMessage = "auto: update $sampleFiles [$timeStr]"
    } else {
        $commitMessage = $customMsg
    }

    Write-HostColor "Committing: '$commitMessage'..." "Magenta"
    $commitOutput = git commit -m $commitMessage 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-HostColor "Commit warning or skipped: $commitOutput" "Yellow"
        return $false
    }

    Write-HostColor "Pushing to GitHub (origin/main)..." "Green"
    $pushOutputMain = git push origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-HostColor "Successfully pushed to origin/main!" "Green"
    } else {
        Write-HostColor "Push to origin/main failed: $pushOutputMain" "Red"
        return $false
    }

    # Keep master synchronized
    git branch -f master main 2>$null
    git push origin master 2>$null | Out-Null
    Write-HostColor "Synchronized origin/master in lockstep." "DarkGreen"

    return $true
}

if ($Once) {
    Write-HostColor "Running in one-shot mode..." "Cyan"
    $synced = Sync-GitRepo -customMsg $Message
    if (-not $synced) {
        Write-HostColor "Repository already clean and up to date." "Green"
    }
    exit 0
}

Write-HostColor "Watcher is active. Watching for file changes every $IntervalSeconds seconds... (Press Ctrl+C to stop)" "Green"

try {
    while ($true) {
        Sync-GitRepo -customMsg $Message
        Start-Sleep -Seconds $IntervalSeconds
    }
} finally {
    Write-HostColor "Watcher stopped." "Yellow"
}
