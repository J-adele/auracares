$overviewPath = "C:/Users/user/.gemini/antigravity/scratch/Kedi health - Copy/overview"
$firePath = "C:/Users/user/.gemini/antigravity/scratch/Kedi health - Copy/fire.md"

# Gather markdown files
$files = Get-ChildItem -Path $overviewPath -Filter *.md

# Build link list
$links = @()
foreach ($file in $files) {
    # Derive a readable title from the first heading if possible, else from filename
    $firstLine = Get-Content $file.FullName -TotalCount 1
    if ($firstLine -match '^#\s+(.*)') {
        $title = $Matches[1].Trim()
    } else {
        $base = $file.BaseName -replace "[_-]", " "
        $title = ($base -split " ") | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower() } -join " "
    }
    $relativePath = "overview/$($file.Name)"
    $links += "- [$title]($relativePath)"
}

# Read fire.md content
$fireContent = Get-Content $firePath -Raw
$marker = "// Health Conditions Data"
if ($fireContent -notmatch [regex]::Escape($marker)) {
    # Append marker at end of file if missing
    $fireContent = $fireContent.TrimEnd() + "`n`n$marker`n"
}
# Split at marker and keep anything after it (if already exists, replace following lines)
$parts = $fireContent -split [regex]::Escape($marker)
$before = $parts[0]
# Compose new section
$newSection = "$marker`n`n" + ($links -join "`n") + "`n"
# Write back
$finalContent = $before.TrimEnd() + "`n`n" + $newSection
Set-Content -Path $firePath -Value $finalContent -Encoding UTF8
Write-Host "Updated fire.md with links to overview files."
