# PowerShell script to populate overview markdown files from health_challenges.json
$jsonPath = "C:/Users/user/.gemini/antigravity/scratch/Kedi health - Copy/health_challenges.json"
$items = Get-Content $jsonPath -Raw | ConvertFrom-Json
foreach ($item in $items) {
    # Create a safe filename from the challenge name
    $slug = ($item.name -replace '[\\/:*?"<>|]', '' -replace '\\s+', '_' -replace '[^\\w_-]', '').ToLower()
    $filename = "$slug.md"
    $fullPath = Join-Path $PSScriptRoot $filename
    if (-not (Test-Path $fullPath)) {
        $content = "# $($item.name)`n`n## Category`n$($item.category)`n`n## Associated Products`n"
        foreach ($p in $item.products) {
            $content += "- $p`n"
        }
        Set-Content -Path $fullPath -Value $content -Encoding UTF8
        Write-Host "Created $filename"
    } else {
        Write-Host "Skipped $filename (already exists)"
    }
}
