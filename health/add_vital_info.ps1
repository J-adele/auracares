# PowerShell script to add a generic Vital Information section to each markdown file in the overview folder
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
Get-ChildItem -Path $folder -Filter *.md | ForEach-Object {
    $content = Get-Content $_.FullName
    # Skip if already contains a Vital Information heading
    if ($content -match '^##\s+Vital Information') {
        Write-Host "Skipped $($_.Name) - already contains Vital Information"
        return
    }
    # Build new content: first line (title) then the Vital Information block, then the rest
    $newContent = @()
    $newContent += $content[0]
    $newContent += ""
    $newContent += "## Vital Information"
    $newContent += "- **Condition:** $($_.BaseName)"
    $newContent += "- **Typical Age Range:** [Add age range]"
    $newContent += "- **Common Symptoms:** [Add symptoms]"
    $newContent += "- **Risk Factors:** [Add risk factors]"
    $newContent += "- **Prevention / Management:** [Add tips]"
    $newContent += ""
    if ($content.Count -gt 1) {
        $newContent += $content[1..($content.Count-1)]
    }
    # Write back to file
    $newContent | Set-Content -Path $_.FullName -Encoding UTF8
    Write-Host "Updated $($_.Name) with Vital Information"
}
