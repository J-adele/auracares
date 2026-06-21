# PowerShell script to rename overview markdown files based on first heading
# This script iterates over all .md files in its directory, extracts the first level-1 heading,
# sanitizes it to a safe filename, and renames the file accordingly.

Get-ChildItem -Path "$PSScriptRoot" -Filter "*.md" | ForEach-Object {
    $firstLine = Get-Content -Path $_.FullName -TotalCount 1
    if ($firstLine -match '^#\s+(.*)') {
        $title = $matches[1].Trim()
        # Sanitize title: remove illegal filesystem characters, replace spaces with underscores, lower case
        $sanitized = $title -replace '[\\/:*?"<>|]', '' -replace '\\s+', '_' -replace '[^\w_-]', ''
        $sanitized = $sanitized.ToLower()
        $newName = "$sanitized.md"
        $newPath = Join-Path $_.DirectoryName $newName
        if (-not (Test-Path $newPath)) {
            Rename-Item -LiteralPath $_.FullName -NewName $newName
            Write-Host "Renamed $($_.Name) -> $newName"
        } else {
            Write-Host "Skipped $($_.Name) because $newName already exists."
        }
    } else {
        Write-Host "No heading found in $($_.Name), skipping."
    }
}
