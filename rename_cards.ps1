# Card Renaming Script for Poker Game - Short Names
# This script renames the Black Myth Wukong card images to very short poker naming convention

# Define the standard poker card names - SHORT VERSION
$suits = @("s", "h", "c", "d")  # spades, hearts, clubs, diamonds
$ranks = @("a", "2", "3", "4", "5", "6", "7", "8", "9", "t", "j", "q", "k")  # ace, 2-9, ten, jack, queen, king
$jokers = @("jr", "jb")  # joker red, joker black

# Get all PNG files in the images directory
$imageFiles = Get-ChildItem ".\images\*.png" | Sort-Object Name

Write-Host "Found $($imageFiles.Count) card images"
Write-Host "Creating SHORT naming system: suits (s,h,c,d) + ranks (a,2-9,t,j,q,k)"
Write-Host ""

# Create a mapping of short poker cards
$shortCards = @()
foreach ($suit in $suits) {
    foreach ($rank in $ranks) {
        $shortCards += "${suit}${rank}.png"
    }
}
$shortCards += "jr.png"  # red joker
$shortCards += "jb.png"  # black joker

Write-Host "Target short card names (54 total):"
$count = 0
foreach ($card in $shortCards) {
    Write-Host "  $card" -NoNewline
    $count++
    if ($count % 10 -eq 0) { Write-Host "" }
}
Write-Host ""
Write-Host ""

# Examples of current to short renaming
Write-Host "Examples of short renaming:"
Write-Host "  hearts_10.png -> ht.png"
Write-Host "  clubs_queen.png -> cq.png" 
Write-Host "  spades_10.png -> st.png"
Write-Host "  spades_ace.png -> sa.png"
Write-Host "  diamonds_king.png -> dk.png"
Write-Host ""

# Create a backup directory
if (!(Test-Path ".\images_backup")) {
    New-Item -ItemType Directory -Path ".\images_backup"
    Write-Host "Created backup directory: .\images_backup"
}

Write-Host "Before renaming, back up your images:"
Write-Host "Copy-Item '.\images\*' '.\images_backup\' -Force"
Write-Host ""

Write-Host "Sample renaming commands for existing files:"
if (Test-Path ".\images\hearts_10.png") {
    Write-Host "Rename-Item '.\images\hearts_10.png' 'ht.png'"
}
if (Test-Path ".\images\clubs_queen.png") {
    Write-Host "Rename-Item '.\images\clubs_queen.png' 'cq.png'"
}
if (Test-Path ".\images\spades_10.png") {
    Write-Host "Rename-Item '.\images\spades_10.png' 'st.png'"
} 