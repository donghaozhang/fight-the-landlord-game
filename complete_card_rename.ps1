# Complete Card Image Renaming Script
# Maps all 113 long-named images to systematic short names for a complete 54-card deck

Write-Host "Starting Complete Card Image Renaming Process..." -ForegroundColor Green

# Define the target directory
$imageDir = ".\images"

# Define complete 54-card deck with short names
$completeCardDeck = @(
    # Spades (13 cards)
    "sa", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "st", "sj", "sq", "sk",
    # Hearts (13 cards)  
    "ha", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "ht", "hj", "hq", "hk",
    # Clubs (13 cards)
    "ca", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ct", "cj", "cq", "ck",
    # Diamonds (13 cards)
    "da", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "dt", "dj", "dq", "dk",
    # Jokers (2 cards)
    "jr", "jb"
)

# Cards that already have short names (skip these)
$existingShortNames = @("ht", "cq", "st", "ha", "hq", "jr", "jb")

# Available short names (remove existing ones from complete deck)
$availableShortNames = $completeCardDeck | Where-Object { $_ -notin $existingShortNames }

Write-Host "Available short names for assignment: $($availableShortNames.Count)" -ForegroundColor Yellow

# Get all long-named images (exclude current short names)
$longNamedImages = Get-ChildItem $imageDir -Name | Where-Object { 
    $_ -notlike "*.png" -or ($_ -like "*@1024x1536.png" -or $_ -like "*@1536x1024.png" -or $_.Length -gt 10)
} | Sort-Object

Write-Host "Long-named images to rename: $($longNamedImages.Count)" -ForegroundColor Yellow

# Intelligent mapping based on filename content
$intelligentMapping = @{}

# First pass: Map obvious cards based on filename content
foreach ($image in $longNamedImages) {
    $targetName = $null
    $imageLower = $image.ToLower()
    
    # Spade mappings
    if ($imageLower -match "spade.*ace|spade.*a(?![\w])" -and "sa" -in $availableShortNames) {
        $targetName = "sa"
    }
    elseif ($imageLower -match "spade.*king|spade.*k(?![\w])" -and "sk" -in $availableShortNames) {
        $targetName = "sk"
    }
    elseif ($imageLower -match "spade.*queen|spade.*q(?![\w])" -and "sq" -in $availableShortNames) {
        $targetName = "sq"
    }
    elseif ($imageLower -match "spade.*jack|spade.*j(?![\w])" -and "sj" -in $availableShortNames) {
        $targetName = "sj"
    }
    elseif ($imageLower -match "spade.*10|spade.*ten" -and "st" -notin $existingShortNames -and "st" -in $availableShortNames) {
        $targetName = "st"
    }
    elseif ($imageLower -match "spade.*9" -and "s9" -in $availableShortNames) {
        $targetName = "s9"
    }
    elseif ($imageLower -match "spade.*8" -and "s8" -in $availableShortNames) {
        $targetName = "s8"
    }
    elseif ($imageLower -match "spade.*7" -and "s7" -in $availableShortNames) {
        $targetName = "s7"
    }
    elseif ($imageLower -match "spade.*6" -and "s6" -in $availableShortNames) {
        $targetName = "s6"
    }
    elseif ($imageLower -match "spade.*5" -and "s5" -in $availableShortNames) {
        $targetName = "s5"
    }
    elseif ($imageLower -match "spade.*4" -and "s4" -in $availableShortNames) {
        $targetName = "s4"
    }
    elseif ($imageLower -match "spade.*3" -and "s3" -in $availableShortNames) {
        $targetName = "s3"
    }
    elseif ($imageLower -match "spade.*2" -and "s2" -in $availableShortNames) {
        $targetName = "s2"
    }
    
    # Heart mappings
    elseif ($imageLower -match "heart.*ace|heart.*a(?![\w])" -and "ha" -notin $existingShortNames -and "ha" -in $availableShortNames) {
        $targetName = "ha"
    }
    elseif ($imageLower -match "heart.*king|heart.*k(?![\w])" -and "hk" -in $availableShortNames) {
        $targetName = "hk"
    }
    elseif ($imageLower -match "heart.*queen|heart.*q(?![\w])" -and "hq" -notin $existingShortNames -and "hq" -in $availableShortNames) {
        $targetName = "hq"
    }
    elseif ($imageLower -match "heart.*jack|heart.*j(?![\w])" -and "hj" -in $availableShortNames) {
        $targetName = "hj"
    }
    elseif ($imageLower -match "heart.*10|heart.*ten" -and "ht" -notin $existingShortNames -and "ht" -in $availableShortNames) {
        $targetName = "ht"
    }
    elseif ($imageLower -match "heart.*9" -and "h9" -in $availableShortNames) {
        $targetName = "h9"
    }
    elseif ($imageLower -match "heart.*8" -and "h8" -in $availableShortNames) {
        $targetName = "h8"
    }
    elseif ($imageLower -match "heart.*7" -and "h7" -in $availableShortNames) {
        $targetName = "h7"
    }
    elseif ($imageLower -match "heart.*6" -and "h6" -in $availableShortNames) {
        $targetName = "h6"
    }
    elseif ($imageLower -match "heart.*5" -and "h5" -in $availableShortNames) {
        $targetName = "h5"
    }
    elseif ($imageLower -match "heart.*4" -and "h4" -in $availableShortNames) {
        $targetName = "h4"
    }
    elseif ($imageLower -match "heart.*3" -and "h3" -in $availableShortNames) {
        $targetName = "h3"
    }
    elseif ($imageLower -match "heart.*2" -and "h2" -in $availableShortNames) {
        $targetName = "h2"
    }
    
    # Club mappings
    elseif ($imageLower -match "club.*ace|club.*a(?![\w])" -and "ca" -in $availableShortNames) {
        $targetName = "ca"
    }
    elseif ($imageLower -match "club.*king|club.*k(?![\w])" -and "ck" -in $availableShortNames) {
        $targetName = "ck"
    }
    elseif ($imageLower -match "club.*queen|club.*q(?![\w])" -and "cq" -notin $existingShortNames -and "cq" -in $availableShortNames) {
        $targetName = "cq"
    }
    elseif ($imageLower -match "club.*jack|club.*j(?![\w])" -and "cj" -in $availableShortNames) {
        $targetName = "cj"
    }
    elseif ($imageLower -match "club.*10|club.*ten" -and "ct" -in $availableShortNames) {
        $targetName = "ct"
    }
    elseif ($imageLower -match "club.*9" -and "c9" -in $availableShortNames) {
        $targetName = "c9"
    }
    elseif ($imageLower -match "club.*8" -and "c8" -in $availableShortNames) {
        $targetName = "c8"
    }
    elseif ($imageLower -match "club.*7" -and "c7" -in $availableShortNames) {
        $targetName = "c7"
    }
    elseif ($imageLower -match "club.*6" -and "c6" -in $availableShortNames) {
        $targetName = "c6"
    }
    elseif ($imageLower -match "club.*5" -and "c5" -in $availableShortNames) {
        $targetName = "c5"
    }
    elseif ($imageLower -match "club.*4" -and "c4" -in $availableShortNames) {
        $targetName = "c4"
    }
    elseif ($imageLower -match "club.*3" -and "c3" -in $availableShortNames) {
        $targetName = "c3"
    }
    elseif ($imageLower -match "club.*2" -and "c2" -in $availableShortNames) {
        $targetName = "c2"
    }
    
    # Diamond mappings
    elseif ($imageLower -match "diamond.*ace|diamond.*a(?![\w])" -and "da" -in $availableShortNames) {
        $targetName = "da"
    }
    elseif ($imageLower -match "diamond.*king|diamond.*k(?![\w])" -and "dk" -in $availableShortNames) {
        $targetName = "dk"
    }
    elseif ($imageLower -match "diamond.*queen|diamond.*q(?![\w])" -and "dq" -in $availableShortNames) {
        $targetName = "dq"
    }
    elseif ($imageLower -match "diamond.*jack|diamond.*j(?![\w])" -and "dj" -in $availableShortNames) {
        $targetName = "dj"
    }
    elseif ($imageLower -match "diamond.*10|diamond.*ten" -and "dt" -in $availableShortNames) {
        $targetName = "dt"
    }
    elseif ($imageLower -match "diamond.*9" -and "d9" -in $availableShortNames) {
        $targetName = "d9"
    }
    elseif ($imageLower -match "diamond.*8" -and "d8" -in $availableShortNames) {
        $targetName = "d8"
    }
    elseif ($imageLower -match "diamond.*7" -and "d7" -in $availableShortNames) {
        $targetName = "d7"
    }
    elseif ($imageLower -match "diamond.*6" -and "d6" -in $availableShortNames) {
        $targetName = "d6"
    }
    elseif ($imageLower -match "diamond.*5" -and "d5" -in $availableShortNames) {
        $targetName = "d5"
    }
    elseif ($imageLower -match "diamond.*4" -and "d4" -in $availableShortNames) {
        $targetName = "d4"
    }
    elseif ($imageLower -match "diamond.*3" -and "d3" -in $availableShortNames) {
        $targetName = "d3"
    }
    elseif ($imageLower -match "diamond.*2" -and "d2" -in $availableShortNames) {
        $targetName = "d2"
    }
    
    # Joker mappings
    elseif ($imageLower -match "joker|鬼牌" -and "jr" -notin $existingShortNames -and "jb" -notin $existingShortNames) {
        if ("jr" -in $availableShortNames) {
            $targetName = "jr"
        } elseif ("jb" -in $availableShortNames) {
            $targetName = "jb"
        }
    }
    
    if ($targetName) {
        $intelligentMapping[$image] = $targetName
        $availableShortNames = $availableShortNames | Where-Object { $_ -ne $targetName }
        Write-Host "Mapped: $image -> $targetName.png" -ForegroundColor Cyan
    }
}

# Second pass: Assign remaining images to remaining short names
$unmappedImages = $longNamedImages | Where-Object { $_ -notin $intelligentMapping.Keys }
$remainingShortNames = $availableShortNames

Write-Host "`nSecond pass: Assigning remaining $($unmappedImages.Count) images to $($remainingShortNames.Count) remaining positions..." -ForegroundColor Yellow

for ($i = 0; $i -lt [Math]::Min($unmappedImages.Count, $remainingShortNames.Count); $i++) {
    $image = $unmappedImages[$i]
    $shortName = $remainingShortNames[$i]
    $intelligentMapping[$image] = $shortName
    Write-Host "Assigned: $image -> $shortName.png" -ForegroundColor Magenta
}

# Display summary
Write-Host "`n=== RENAMING SUMMARY ===" -ForegroundColor Green
Write-Host "Total mappings created: $($intelligentMapping.Count)" -ForegroundColor White
Write-Host "Cards with existing short names: $($existingShortNames.Count)" -ForegroundColor White
Write-Host "Total cards after renaming: $($intelligentMapping.Count + $existingShortNames.Count)" -ForegroundColor White

# Ask for confirmation
$confirmation = Read-Host "`nProceed with renaming? (y/N)"
if ($confirmation -ne "y" -and $confirmation -ne "Y") {
    Write-Host "Renaming cancelled." -ForegroundColor Red
    exit
}

# Perform the renaming
Write-Host "`nStarting renaming process..." -ForegroundColor Green
$renamedCount = 0

foreach ($mapping in $intelligentMapping.GetEnumerator()) {
    $oldPath = Join-Path $imageDir $mapping.Key
    $newPath = Join-Path $imageDir "$($mapping.Value).png"
    
    if (Test-Path $oldPath) {
        try {
            Rename-Item -Path $oldPath -NewName "$($mapping.Value).png" -Force
            Write-Host "✓ Renamed: $($mapping.Key) -> $($mapping.Value).png" -ForegroundColor Green
            $renamedCount++
        }
        catch {
            Write-Host "✗ Failed to rename: $($mapping.Key) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "✗ File not found: $($mapping.Key)" -ForegroundColor Red
    }
}

Write-Host "`n=== FINAL RESULTS ===" -ForegroundColor Green
Write-Host "Successfully renamed: $renamedCount files" -ForegroundColor White
Write-Host "Final card count: $(@(Get-ChildItem $imageDir -Name "*.png").Count)" -ForegroundColor White

# Display final short-named cards
Write-Host "`nFinal short-named cards:" -ForegroundColor Yellow
Get-ChildItem $imageDir -Name "*.png" | Where-Object { $_.Length -le 6 } | Sort-Object | ForEach-Object {
    Write-Host "  $_" -ForegroundColor Cyan
}

Write-Host "`nCard renaming process completed!" -ForegroundColor Green 