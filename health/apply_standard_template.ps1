$folder = "C:/Users/user/.gemini/antigravity/scratch/Kedi health - Copy/overview"
Get-ChildItem -Path $folder -Filter *.md | ForEach-Object {
    $base = $_.BaseName
    # Convert filename to title case with spaces
    $title = ($base -replace "[_-]", " ") -replace "\b(\w)" { $args[0].Value.ToUpper() }
    $content = @(
        "# $title",
        "",
        "## Vital Information",
        "- **Condition:** $base",
        "- **Typical Age Range:** [Add age range]",
        "- **Common Symptoms:** [Add symptoms]",
        "- **Risk Factors:** [Add risk factors]",
        "- **Prevention / Management:** [Add tips]",
        "",
        "## Overview",
        "*Placeholder description for $title.*",
        "",
        "## Symptoms",
        "- [Add symptoms specific to $title]",
        "",
        "## Causes",
        "- [Add causes specific to $title]",
        "",
        "## Diagnosis",
        "- [Add diagnosis info]",
        "",
        "## Treatment",
        "- [Add treatment options]",
        "",
        "## Prevention",
        "- [Add preventive measures]",
        "",
        "## Category",
        "- [Add category]",
        "",
        "## Associated Products",
        "- [Add products]",
        "",
        "## References",
        "- [Add references]"
    )
    $content | Set-Content -Path $_.FullName -Encoding UTF8
    Write-Host "Standardized $($_.Name)"
}
